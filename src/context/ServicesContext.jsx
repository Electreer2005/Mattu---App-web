import { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES } from '../data/services';

const ServicesContext = createContext(null);
const STORAGE_KEY = 'matu:services';

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SERVICES;
    } catch {
      return SERVICES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const createService = (data) => {
    setServices((prev) => [{ ...data }, ...prev]);
    return data;
  };

  const updateService = (slug, data) =>
    setServices((prev) => prev.map((s) => (s.slug === slug ? { ...s, ...data } : s)));

  const deleteService = (slug) =>
    setServices((prev) => prev.filter((s) => s.slug !== slug));

  return (
    <ServicesContext.Provider value={{ services, createService, updateService, deleteService }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices debe usarse dentro de ServicesProvider');
  return ctx;
};