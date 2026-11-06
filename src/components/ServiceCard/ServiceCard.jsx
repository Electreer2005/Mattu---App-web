import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ServiceCard.css';

const ServiceCard = ({ category, title, description, image, alt, slug }) => {
  const detailPath = `/servicios/${slug}`;   // ← path param, no query

  return (
    <article className="service-card">
      <Link to={detailPath} className="service-card__image">
        <img src={image} alt={alt} loading="lazy" />
        <span className="service-card__badge">{category}</span>
      </Link>

      <div className="service-card__info">
        <h3 className="service-card__title">{title}</h3>
        <p className="service-card__description">{description}</p>
        <Link to={detailPath} className="service-card__cta">
          Personalizar solicitud <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;