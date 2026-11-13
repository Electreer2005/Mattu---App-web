import { useState } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { CATEGORIES } from '../../data/services'; // Ya no importamos SERVICES
import { useServices } from '../../context/ServicesContext';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  // Obtenemos los servicios reales del contexto (incluye los que creás en el admin)
  const { services } = useServices();
  
  // Generamos las categorías mezclando las estáticas con las nuevas que agregues
  const categories = ['Todos', ...new Set([...CATEGORIES.filter((c) => c !== 'Todos'), ...services.map((s) => s.category).filter(Boolean)])];

  // ACÁ ESTÁ LA CORRECCIÓN: Usamos 'services' en vez de 'SERVICES'
  const filtered =
    activeCategory === 'Todos'
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div className="services-page">
      {/* Header */}
      <header className="services-page__header">
        <p className="eyebrow">Nuestros servicios</p>
        <h1>Elegí qué querés contar</h1>
        <p className="services-page__intro">
          Grabados en joyas, madera, cuero y virolas.
          Sumá los servicios que te interesan y armamos tu solicitud.
        </p>
      </header>

      {/* Filtros */}
      <div
        className="services-page__filters"
        role="tablist"
        aria-label="Filtrar por categoría"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`services-page__filter${
              activeCategory === cat ? ' is-active' : ''
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="services-page__grid">
          {filtered.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
      ) : (
        <p className="services-page__empty">
          No hay servicios en esta categoría todavía.
        </p>
      )}
    </div>
  );
};

export default Services;
