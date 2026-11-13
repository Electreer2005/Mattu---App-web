import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import { useServices } from '../../context/ServicesContext';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();

  // 1. Traemos los servicios y el estado de carga desde el contexto
  const { services, catalogLoading } = useServices();

  // 2. Buscamos el servicio en el array usando el slug
  const service = services.find((s) => s.slug === slug);

  const [form, setForm] = useState({
    piece: '',
    material: '',
    quantity: 1,
    design: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Si está cargando, mostramos un mensaje (o un spinner)
  if (catalogLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p className="muted">Cargando servicio...</p>
      </div>
    );
  }

  // 4. Si terminó de cargar y no lo encontró, mostramos el error
  if (!service) {
    return (
      <div className="service-detail__not-found">
        <h1>Servicio no encontrado</h1>
        <p className="muted">Puede que el enlace esté mal o que ya no exista.</p>
        <Link to="/servicios" className="btn btn--primary">
          <ArrowLeft size={16} aria-hidden="true" /> Volver a servicios
        </Link>
      </div>
    );
  }

  // Relacionados: usamos 'services' del contexto
  const related = services.filter(
    (s) => s.category === service.category && s.slug !== service.slug
  ).slice(0, 3);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.piece || !form.design.trim() || Number(form.quantity) < 1) {
      toast('Completá los campos obligatorios', { type: 'error' });
      return;
    }

    setIsSubmitting(true);
    addItem({
      id: `service-${service.slug}`,
      serviceId: service.slug,
      name: service.title,
      category: service.category,
      image: service.image,
      alt: service.alt,
      piece: form.piece,
      material: form.material,
      design: form.design,
      price: 0,
    }, Number(form.quantity));
    toast('Servicio agregado a tu solicitud', { type: 'success' });
    setIsSubmitting(false);
    navigate('/carrito');
  };

  return (
    <div className="service-detail">
      {/* Breadcrumb */}
      <nav className="service-detail__breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to="/servicios">Servicios</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{service.title}</span>
      </nav>

      {/* Hero: imagen + info + form */}
      <div className="service-detail__hero">
        {/* Imagen */}
        <div className="service-detail__media">
          <img src={service.image} alt={service.alt} />
          <span className="service-detail__badge">{service.category}</span>
        </div>

        {/* Info */}
        <div className="service-detail__info">
          <p className="eyebrow">Servicio de grabado</p>
          <h1>{service.title}</h1>
          <p className="service-detail__description">{service.detail}</p>

          <ul className="service-detail__pieces">
            {service.pieces?.map((p) => (
              <li key={p}>
                <Check size={14} aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>

          <div className="service-detail__note">
            <strong>El precio se confirma</strong> al revisar la pieza y el diseño.
            Armá tu solicitud y te respondemos con la propuesta.
          </div>
        </div>

        {/* Formulario */}
        <form className="service-detail__form" onSubmit={handleSubmit}>
          <h2>Solicitar este grabado</h2>

          <label htmlFor="piece">Tipo de pieza *</label>
          <select
            id="piece"
            name="piece"
            value={form.piece}
            onChange={handleChange}
            required
            className='Input'
          >
            <option value="">Elegí una opción</option>
            {service.pieces?.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value="Otra">Otra pieza</option>
          </select>

          <div className="service-detail__row">
            <div>
              <label htmlFor="material">Material</label>
              <input
                id="material"
                name="material"
                type="text"
                maxLength={80}
                placeholder="Ej. plata, madera, cuero…"
                value={form.material}
                onChange={handleChange}
                className='Input'
              />
            </div>
            <div>
              <label htmlFor="quantity">Cantidad *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={9999}
                required
                value={form.quantity}
                onChange={handleChange}
                className='Input'
              />
            </div>
          </div>

          <label htmlFor="design">Texto o detalles del grabado *</label>
          <textarea
            id="design"
            name="design"
            rows={3}
            maxLength={1500}
            required
            placeholder="Texto exacto, diseño, medida aproximada…"
            value={form.design}
            onChange={handleChange}
            className='Input'
          />

          <p className="service-detail__form-note">
            Revisamos la viabilidad y el precio antes de confirmar.
          </p>

          <button
            type="submit"
            className="btn btn--primary btn--lg btn--block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Agregando…'
            ) : (
              <>
                <Plus size={16} aria-hidden="true" /> Agregar a mi solicitud
              </>
            )}
          </button>

          <p className="service-detail__form-note service-detail__form-note--muted">
            Después de agregar, vas a poder sumar más servicios antes de enviar.
          </p>
        </form>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="service-detail__related">
          <div className="service-detail__related-heading">
            <div>
              <p className="eyebrow">También te puede interesar</p>
              <h2>Otros grabados {service.category?.toLowerCase()}s</h2>
            </div>
            <Link to="/servicios" className="quiet-link">
              Ver todos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="service-detail__related-grid">
            {related.map((s) => (
              <ServiceCard key={s.slug} {...s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetailPage;
