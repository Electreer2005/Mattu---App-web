import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/ProductCard/ProductCard';

const Favorites = () => {
  const { favorites, count, clearFavorites } = useFavorites();
  const { toast } = useToast();

  const handleClear = () => {
    if (!count) return;
    const ok = window.confirm('¿Vaciar todos tus favoritos?');
    if (!ok) return;
    clearFavorites();
    toast('Favoritos vaciados', { type: 'info' });
  };

  return (
    <div className="Favorites-page">
      <header className="Favorites-header">
        <div>
          <h1>Mis favoritos</h1>
          <p>
            {count > 0
              ? `Tenés ${count} ${count === 1 ? 'pieza guardada' : 'piezas guardadas'}.`
              : 'Guardá las piezas que te gusten con el corazón.'}
          </p>
        </div>
        {count > 0 && (
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={handleClear}
          >
            Vaciar
          </button>
        )}
      </header>

      {count === 0 ? (
        <div className="Favorites-empty">
          <div className="Favorites-empty-icon">
            <Heart size={32} />
          </div>
          <h2>Todavía no tenés favoritos</h2>
          <p>Explorá la colección y tocá el corazón para guardarlos acá.</p>
          <Link to="/productos" className="btn btn--primary">
            <ShoppingBag size={16} /> Ver productos
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="Favorites-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;