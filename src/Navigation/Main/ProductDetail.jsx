import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Star,
  Check,
  Truck,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getProductById,
  getRelatedProducts,
} from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const product = getProductById(id);

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [customization, setCustomization] = useState('');

  // Favorito derivado del contexto global (persistente)
  const wishlisted = product ? isFavorite(product.id) : false;

  const related = useMemo(
    () => (product ? getRelatedProducts(product, 4) : []),
    [product]
  );

  if (!product) {
    return (
      <div className="product-detail__not-found">
        <h1>Producto no encontrado</h1>
        <p className="muted">
          Puede que el enlace esté mal o que el producto ya no exista.
        </p>
        <Link to="/productos" className="btn btn--primary">
          <ArrowLeft size={16} aria-hidden="true" /> Volver a productos
        </Link>
      </div>
    );
  }

  const images = product.images || [{ src: product.image, alt: product.alt }];
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (product.customizable && !customization.trim()) {
      toast(`Completá "${product.customizationLabel}"`, { type: 'error' });
      return;
    }

    addItem(
      {
        ...product,
        customization: customization.trim() || null,
      },
      qty
    );

    toast(`${qty} × ${product.name} agregado`, { type: 'success' });

    // Reset suave
    setCustomization('');
    setQty(1);
  };

  const handleWishlist = () => {
    toggleFavorite(product);
    toast(
      wishlisted
        ? `${product.name} quitado de favoritos`
        : `${product.name} agregado a favoritos`,
      { type: 'info' }
    );
  };

  const nextImage = () =>
    setActiveImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="product-detail">
      {/* ---------- BREADCRUMB ---------- */}
      <nav className="product-detail__breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to="/productos">Productos</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      {/* ---------- HERO ---------- */}
      <div className="product-detail__hero">
        {/* Galería */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={images[activeImage].src}
              alt={images[activeImage].alt}
              className="product-gallery__image"
            />

            {product.badge && (
              <span
                className={`product-gallery__badge product-gallery__badge--${product.badge}`}
              >
                {product.badge === 'new' && 'Nuevo'}
                {product.badge === 'sale' && `-${discount}%`}
                {product.badge === 'custom' && 'Grabado'}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="product-gallery__nav product-gallery__nav--prev"
                  onClick={prevImage}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="product-gallery__nav product-gallery__nav--next"
                  onClick={nextImage}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-gallery__thumbs" role="tablist">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activeImage}
                  className={`product-gallery__thumb${
                    i === activeImage ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={img.src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>

          <h1 className="product-detail__title">{product.name}</h1>

          {product.rating && (
            <div className="product-detail__rating">
              <div className="product-detail__stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={16}
                    fill={n <= Math.round(product.rating) ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span>
                {product.rating} · {product.reviews} reseñas
              </span>
            </div>
          )}

          <div className="product-detail__price-row">
            <span className="product-detail__price">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="product-detail__price-old">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {discount && (
              <span className="product-detail__discount">-{discount}%</span>
            )}
          </div>

          <p className="product-detail__description">{product.description}</p>

          <ul className="product-detail__features">
            {product.features.map((feature, i) => (
              <li key={i}>
                <Check size={16} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Personalización */}
          {product.customizable && (
            <div className="product-detail__custom">
              <label htmlFor="customization" className="product-detail__custom-label">
                <Sparkles size={16} aria-hidden="true" />
                {product.customizationLabel} *
              </label>
              <input
                id="customization"
                type="text"
                className="product-detail__custom-input"
                placeholder={product.customizationPlaceholder}
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
                maxLength={product.customizationMax}
                required
              />
              <div className="product-detail__custom-meta">
                <span>
                  {customization.length}/{product.customizationMax} caracteres
                </span>
                <span className="muted">
                  Revisamos el diseño antes de grabar.
                </span>
              </div>
            </div>
          )}

          {/* Qty + Agregar */}
          <div className="product-detail__actions">
            <div className="product-detail__qty" role="group" aria-label="Cantidad">
              <button
                type="button"
                className="product-detail__qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Restar"
              >
                <Minus size={16} />
              </button>
              <span className="product-detail__qty-value" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="product-detail__qty-btn"
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                disabled={qty >= (product.stock || 99)}
                aria-label="Sumar"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--lg product-detail__add"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              Agregar al carrito
            </button>

            <button
              type="button"
              className={`product-detail__wishlist${wishlisted ? ' is-active' : ''}`}
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-pressed={wishlisted}
            >
              <Heart
                size={20}
                fill={wishlisted ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Stock */}
          {product.stock && (
            <p className="product-detail__stock">
              {product.stock <= 5 ? (
                <>
                  <span className="product-detail__stock-dot product-detail__stock-dot--low" />
                  ¡Últimas {product.stock} unidades!
                </>
              ) : (
                <>
                  <span className="product-detail__stock-dot" />
                  Disponible ({product.stock} unidades)
                </>
              )}
            </p>
          )}

          {/* Benefits */}
          <ul className="product-detail__benefits">
            <li>
              <Truck size={18} aria-hidden="true" />
              <div>
                <strong>Envío a todo el país</strong>
                <span>Calculamos el costo al confirmar el pedido.</span>
              </div>
            </li>
            <li>
              <Shield size={18} aria-hidden="true" />
              <div>
                <strong>Pago seguro</strong>
                <span>Transferencia o mercado pago.</span>
              </div>
            </li>
            <li>
              <Sparkles size={18} aria-hidden="true" />
              <div>
                <strong>Hecho a mano</strong>
                <span>Cada pieza se hace en tandas pequeñas.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ---------- RELACIONADOS ---------- */}
      {related.length > 0 && (
        <section className="product-detail__related">
          <div className="product-detail__related-heading">
            <div>
              <p className="eyebrow">También te puede gustar</p>
              <h2>Más de {product.category.toLowerCase()}</h2>
            </div>
            <Link to="/productos" className="quiet-link">
              Ver todos <ArrowRightIcon />
            </Link>
          </div>

          <div className="product-detail__related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Pequeño wrapper para no importar ArrowRight en dos lados
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default ProductDetail;