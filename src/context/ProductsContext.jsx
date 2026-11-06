import { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const ProductsContext = createContext(null);
const STORAGE_KEY = 'matu:products';

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const createProduct = (data) => {
    const id = `p-${Date.now()}`;
    const next = { ...data, id };
    setProducts((prev) => [next, ...prev]);
    return next;
  };

  const updateProduct = (id, data) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, id } : p)));

  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <ProductsContext.Provider value={{ products, createProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
};