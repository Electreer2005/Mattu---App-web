import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatPrice } from '../../utils/format';
import './ProductCard.css';

const BADGE_LABELS = {
  new: 'Nuevo',
  sale: 'Oferta',
  custom: 'Grabado',
  soldout: 'Agotado',
};

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isWishlisted = isFavorite(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast(`${product.name} agregado`, { type: 'success' });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleFavorite(product);
  };

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link to={`/productos/${product.id}`} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.alt}
            className="product-card__image"
            loading="lazy"
          />
        </Link>

        {product.badge && (
          <div className="product-card__badges">
            <span className={`product-card__badge product-card__badge--${product.badge}`}>
              {BADGE_LABELS[product.badge]}
            </span>
          </div>
        )}

        <button
          type="button"
          className="product-card__wishlist"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={isWishlisted}
        >
          <Heart
            size={16}
            fill={isWishlisted ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>

        <Link to={`/productos/${product.id}`} className="product-card__title">
          {product.name}
        </Link>

        {product.rating && (
          <div className="product-card__rating">
            <Star size={12} fill="currentColor" aria-hidden="true" />
            <span>{product.rating}</span>
            <span className="product-card__reviews">({product.reviews})</span>
          </div>
        )}

        <div className="product-card__price">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="product-card__price-old">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="product-card__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={14} aria-hidden="true" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;