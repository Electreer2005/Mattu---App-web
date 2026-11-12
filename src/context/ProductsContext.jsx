import { createContext, useContext, useEffect, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { customerApi } from '../services/customerApi';

const ProductsContext = createContext(null);
const STORAGE_KEY = 'matu:products';

const initialProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : PRODUCTS;
  } catch { return PRODUCTS; }
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let active = true;
    customerApi('catalog/products')
      .then(({ products: remote = [], deletedIds = [] }) => {
        if (!active) return;
        const hidden = new Set(deletedIds);
        setProducts((local) => {
          const merged = new Map();
          [...PRODUCTS, ...local, ...remote].forEach((item) => {
            if (item?.id && !hidden.has(item.id)) merged.set(item.id, item);
          });
          return [...merged.values()];
        });
        setCatalogError('');
      })
      .catch((error) => { if (active) setCatalogError(error.message); })
      .finally(() => { if (active) setCatalogLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const createProduct = async (data) => {
    const payload = { ...data, id: data.id || crypto.randomUUID() };
    const { item } = await customerApi('catalog/products', {
      method: 'POST', body: JSON.stringify(payload),
    });
    setProducts((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
    return item;
  };

  const updateProduct = async (id, data) => {
    const { item } = await customerApi(`catalog/products/${encodeURIComponent(id)}`, {
      method: 'PUT', body: JSON.stringify(data),
    });
    setProducts((prev) => prev.map((p) => p.id === id ? item : p));
    return item;
  };

  const deleteProduct = async (id) => {
    await customerApi(`catalog/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, createProduct, updateProduct, deleteProduct, catalogLoading, catalogError }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
};
