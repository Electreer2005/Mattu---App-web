import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { CATEGORIES, SERVICES } from '../../data/services';
import { useServices } from '../../context/ServicesContext';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { services } = useServices();
  const categories = ['Todos', ...new Set([...CATEGORIES.filter((c) => c !== 'Todos'), ...services.map((s) => s.category).filter(Boolean)])];

  const filtered =
    activeCategory === 'Todos'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

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

      {/* CTA final */}
      <div className="services-page__cta">
        <div>
          <p className="eyebrow">¿No encontrás lo que buscás?</p>
          <h2>Contanos tu idea.</h2>
          <p className="muted">
            Si tenés un proyecto especial, escribinos y vemos cómo hacerlo.
          </p>
        </div>
        <a className="btn btn--primary btn--lg" href="#contacto">
          Contactanos <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default Services;
