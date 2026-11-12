import { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES } from '../data/services';
import { customerApi } from '../services/customerApi';

const ServicesContext = createContext(null);
const STORAGE_KEY = 'matu:services';

const initialServices = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SERVICES;
  } catch { return SERVICES; }
};

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState(initialServices);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let active = true;
    customerApi('catalog/services')
      .then(({ services: remote = [], deletedIds = [] }) => {
        if (!active) return;
        const hidden = new Set(deletedIds);
        setServices((local) => {
          const merged = new Map();
          [...SERVICES, ...local, ...remote].forEach((item) => {
            if (item?.slug && !hidden.has(item.slug)) merged.set(item.slug, item);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const createService = async (data) => {
    const payload = { ...data, id: data.slug };
    const { item } = await customerApi('catalog/services', {
      method: 'POST', body: JSON.stringify(payload),
    });
    setServices((prev) => [item, ...prev.filter((s) => s.slug !== item.slug)]);
    return item;
  };

  const updateService = async (slug, data) => {
    const { item } = await customerApi(`catalog/services/${encodeURIComponent(slug)}`, {
      method: 'PUT', body: JSON.stringify(data),
    });
    setServices((prev) => prev.map((s) => s.slug === slug ? item : s));
    return item;
  };

  const deleteService = async (slug) => {
    await customerApi(`catalog/services/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    setServices((prev) => prev.filter((s) => s.slug !== slug));
  };

  return (
    <ServicesContext.Provider value={{ services, createService, updateService, deleteService, catalogLoading, catalogError }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices debe usarse dentro de ServicesProvider');
  return ctx;
};
