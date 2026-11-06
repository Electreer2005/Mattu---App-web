import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PenTool,
  Gem,
  Boxes,
  Pause,
  Play,
} from 'lucide-react';
import {FaInstagram} from 'react-icons/fa';
import ServiceCard from '../../components/ServiceCard/ServiceCard';

/* ---------- Datos ---------- */
const SLIDES = [
  {
    image: '/Img/Banner-4.jpeg',
    alt: 'Dijes con iniciales y un corazón grabado',
    caption: 'Dos piezas. Una misma historia.',
  },
  {
    image: '/Img/Banner-1.jpeg',
    alt: 'Pulsera con nombre grabado',
    caption: 'Un nombre que significa todo.',
  },
  {
    image: '/Img/Banner-3.jpeg',
    alt: 'Dije con fotografía grabada',
    caption: 'Un instante, siempre cerca.',
  },
];

const SERVICES = [
  {
    slug: 'nombres',
    category: 'Texto',
    title: 'Nombres y fechas',
    description: 'Un nombre, una fecha o unas palabras que quieras llevar cerca.',
    image: '/Img/Banner-1.jpeg',
    alt: 'Pulsera con el nombre Aranzazu grabado',
  },
  {
    slug: 'miradas',
    category: 'Imagen',
    title: 'Miradas y detalles',
    description: 'Esa mirada que reconocés entre todas, grabada en una pieza.',
    image: '/Img/Banner-2.jpeg',
    alt: 'Pulsera con una mirada grabada',
  },
  {
    slug: 'retratos',
    category: 'Imagen',
    title: 'Retratos en metal',
    description: 'Transformá una fotografía en un recuerdo que puedas llevar con vos.',
    image: '/Img/Banner-3.jpeg',
    alt: 'Dije circular con un retrato grabado',
  },
  {
    slug: 'simbolos',
    category: 'Diseño',
    title: 'Símbolos y diseños',
    description: 'Iniciales, símbolos y diseños pensados para una pieza especial.',
    image: '/Img/Banner-4.jpeg',
    alt: 'Dos dijes con iniciales y un corazón',
  },
  {
    slug: 'madera',
    category: 'Madera',
    title: 'Grabado en madera',
    description: 'Nombres, logos y diseños sobre piezas de madera.',
    image: '/Img/tabla-madera.svg',
    alt: 'Tabla de madera grabada',
  },
  {
    slug: 'cuero',
    category: 'Cuero',
    title: 'Grabado en cuero',
    description: 'Personalizá artículos de cuero con textos, iniciales o diseños.',
    image: '/Img/cuchillo-cuero.svg',
    alt: 'Cuchillo y funda de cuero',
  },
  {
    slug: 'virola',
    category: 'Virola',
    title: 'Grabado en virola',
    description: 'Textos, iniciales y diseños personalizados en virolas de mates.',
    image: '/Img/virola-nacho.svg',
    alt: 'Virola de mate grabada',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Elegí tu grabado',
    description: 'Sumá los servicios que te interesan a tu solicitud.',
  },
  {
    number: '02',
    title: 'Contanos los detalles',
    description: 'Texto, cantidad, material y la idea que tenés en mente.',
  },
  {
    number: '03',
    title: 'Confirmamos juntos',
    description: 'El equipo revisa la propuesta y acuerda precio y entrega.',
  },
];

const GALLERY = [
  { src: '/Img/Banner-1.jpeg', alt: 'Pulsera con nombre grabado' },
  { src: '/Img/Banner-2.jpeg', alt: 'Pulsera con mirada grabada' },
  { src: '/Img/Banner-3.jpeg', alt: 'Dije con retrato grabado' },
  { src: '/Img/Banner-4.jpeg', alt: 'Dijes con iniciales' },
  { src: '/Img/vaso-grabado.svg', alt: 'Vaso térmico grabado' },
  { src: '/Img/termo-disenos.svg', alt: 'Termo con diseños' },
  { src: '/Img/virola-disenos.svg', alt: 'Virola con dibujos' },
  { src: '/Img/tabla-madera.svg', alt: 'Tabla de madera grabada' },
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play del hero (pausa si el usuario toca el botón)
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar con backend / WhatsApp
    console.log('Contact form listo para enviar');
  };

  return (
    <div className="home">
      {/* ---------- ANNOUNCEMENT ---------- */}
      <div className="home__announcement">
        Grabados personalizados · Consultas mayoristas
      </div>

      {/* ---------- HERO ---------- */}
      <section className="home-hero container">
        <div className="home-hero__copy">
          <p className="eyebrow">Grabados con identidad</p>

          <h1 className="home-hero__title">
            Hay recuerdos<br />
            que merecen<br />
            <em>quedarse.</em>
          </h1>

          <p className="home-hero__description">
            Un nombre. Una mirada. Una historia.<br />
            Los grabamos en joyas, madera, cuero y virolas para que los lleves con vos.
          </p>

          <div className="home-hero__actions">
            <Link to="/servicios" className="btn btn--primary btn--lg">
              Encontrá tu grabado <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#contacto" className="quiet-link">
              ¿Tenés una joyería? Hablemos
            </a>
          </div>

          <div className="home-hero__caption">
            <span className="home-hero__caption-line" aria-hidden="true" />
            Joyas · Madera · Cuero · Virolas
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__slider" aria-label="Ejemplos de grabados">
            {SLIDES.map((slide, i) => (
              <figure
                key={i}
                className={`home-hero__slide${i === activeSlide ? ' is-active' : ''}`}
              >
                <img src={slide.image} alt={slide.alt} />
                <figcaption>{slide.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="home-hero__controls">
            <span>Hecho para vos</span>
            <div className="home-hero__dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`home-hero__dot${i === activeSlide ? ' is-active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Ver ejemplo ${i + 1}`}
                  aria-pressed={i === activeSlide}
                />
              ))}
              <button
                type="button"
                className="home-hero__pause"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? 'Reanudar presentación' : 'Pausar presentación'}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          </div>

          <span className="home-hero__image-label">El valor está en el detalle</span>
        </div>
      </section>

      {/* ---------- QUALITIES ---------- */}
      <div className="home-qualities">
        <div className="container home-qualities__inner">
          <span><PenTool size={18} aria-hidden="true" /> Diseños personalizados</span>
          <span><Gem size={18} aria-hidden="true" /> Cada pieza se evalúa</span>
          <span><Boxes size={18} aria-hidden="true" /> Consultas mayoristas</span>
        </div>
      </div>

      {/* ---------- SERVICES ---------- */}
      <section className="section container">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Elegí qué querés contar</p>
            <h2>Pequeñas piezas.<br />Grandes historias.</h2>
          </div>
          <Link to="/servicios" className="quiet-link">
            Ver todos los servicios <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="home-service-grid">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
      </section>

      {/* ---------- STORY ---------- */}
      <section className="home-story">
        <div className="container home-story__grid">
          <div className="home-story__image">
            <img
              src="/Img/Banner-2.jpeg"
              alt="Detalle de una mirada grabada en una pulsera"
              loading="lazy"
            />
          </div>

          <div className="home-story__copy">
            <p className="eyebrow">Del recuerdo a la pieza</p>
            <h2>Tu idea es<br />el punto de partida.</h2>
            <p className="home-story__intro">
              No hace falta tener todo resuelto. Contanos qué querés grabar y sobre qué pieza. Revisamos juntos el diseño, las medidas y las posibilidades.
            </p>

            <ol className="home-steps">
              {STEPS.map((step) => (
                <li key={step.number} className="home-steps__item">
                  <span className="home-steps__number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link to="/servicios" className="btn btn--primary">
              Empezar mi solicitud <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- GALLERY ---------- */}
      <section className="section container">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Inspiración Mattu</p>
            <h2>El detalle, de cerca.</h2>
          </div>
          <p className="muted">Explorá las piezas y encontrá tu próxima idea.</p>
        </div>

        <div className="home-gallery">
          {GALLERY.map((img, i) => (
            <button
              key={i}
              type="button"
              className="home-gallery__item"
              aria-label={`Ampliar: ${img.alt}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contacto" className="home-contact">
        <div className="container home-contact__grid">
          <div className="home-contact__intro">
            <p className="eyebrow">Conversemos</p>
            <h2>¿Qué te gustaría<br /><em>grabar?</em></h2>
            <p>
              Una pieza especial o un pedido para tu joyería.<br />
              Contanos tu idea y preparemos el próximo paso.
            </p>

            <a
              className="home-instagram-link"
              href="https://www.instagram.com/mattu.ar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={18} aria-hidden="true" />
              También nos encontrás en @mattu.ar ↗
            </a>
          </div>

          <form className="home-contact__form" onSubmit={handleContactSubmit}>
            <label htmlFor="contact-name">Tu nombre / joyería *</label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              maxLength={120}
              required
              placeholder="¿Cómo te llamás?"
              className="Input"
            />

            <div className="home-form-row">
              <div>
                <label htmlFor="contact-phone">Teléfono *</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  required
                  placeholder="Código de área y número"
                  className="Input"
                />
              </div>
              <div>
                <label htmlFor="contact-email">Correo (opcional)</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={160}
                  placeholder="tu@correo.com"
                  className="Input"
                />
              </div>
            </div>

            <label htmlFor="contact-message">Tu idea *</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              maxLength={2000}
              required
              placeholder="Pieza, grabado, cantidad…"
              className="Input"
            />

            <button className="btn btn--primary btn--lg btn--block" type="submit">
              Preparar consulta <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="home-form-note">
              Revisás el mensaje antes de enviarlo por WhatsApp.
            </p>
          </form>
        </div> 
      </section>
    </div>
  );
};

export default Home;