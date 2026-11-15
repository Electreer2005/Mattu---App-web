import { createContext, useContext, useEffect, useState } from 'react';
import { customerApi } from '../services/customerApi';

const ServicesContext = createContext(null);

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let active = true;
    customerApi('catalog/services')
      .then(({ services: remote = [], deletedIds = [] }) => {
        if (!active) return;
        const hidden = new Set(deletedIds);
        setServices(remote.filter((item) => item?.slug && !hidden.has(item.slug)));
        setCatalogError('');
      })
      .catch((error) => {
        if (active) {
          setServices([]);
          setCatalogError(error.message || 'No se pudieron cargar los servicios.');
        }
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });
    return () => { active = false; };
  }, []);

  const createService = async (data) => {
    const payload = { ...data, id: data.slug };
    const { item } = await customerApi('catalog/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setServices((prev) => [item, ...prev.filter((service) => service.slug !== item.slug)]);
    return item;
  };

  const updateService = async (slug, data) => {
    const { item } = await customerApi(`catalog/services/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setServices((prev) => prev.map((service) => service.slug === slug ? item : service));
    return item;
  };

  const deleteService = async (slug) => {
    await customerApi(`catalog/services/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    setServices((prev) => prev.filter((service) => service.slug !== slug));
  };

  return (
    <ServicesContext.Provider value={{
      services, createService, updateService, deleteService, catalogLoading, catalogError,
    }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices debe usarse dentro de ServicesProvider');
  return ctx;
};
