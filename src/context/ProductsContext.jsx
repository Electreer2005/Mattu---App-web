import { createContext, useContext, useEffect, useState } from 'react';
import { customerApi } from '../services/customerApi';

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let active = true;
    customerApi('catalog/products')
      .then(({ products: remote = [], deletedIds = [] }) => {
        if (!active) return;
        const hidden = new Set(deletedIds);
        setProducts(remote.filter((item) => item?.id && !hidden.has(item.id)));
        setCatalogError('');
      })
      .catch((error) => {
        if (active) {
          setProducts([]);
          setCatalogError(error.message || 'No se pudo cargar el catálogo.');
        }
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });
    return () => { active = false; };
  }, []);

  const createProduct = async (data) => {
    const payload = { ...data, id: data.id || crypto.randomUUID() };
    const { item } = await customerApi('catalog/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setProducts((prev) => [item, ...prev.filter((product) => product.id !== item.id)]);
    return item;
  };

  const updateProduct = async (id, data) => {
    const { item } = await customerApi(`catalog/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setProducts((prev) => prev.map((product) => product.id === id ? item : product));
    return item;
  };

  const deleteProduct = async (id) => {
    await customerApi(`catalog/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <ProductsContext.Provider value={{
      products, createProduct, updateProduct, deleteProduct, catalogLoading, catalogError,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
};
