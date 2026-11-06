import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../../data/products';


const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'name', label: 'Nombre A–Z' },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');

  const products = useMemo(() => {
    let result =
      activeCategory === 'Todos'
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="products-page">
      <header className="products-page__header">
        <p className="eyebrow">Tienda Mattu</p>
        <h1>Piezas listas para llevar</h1>
        <p className="products-page__intro">
          Joyas y objetos grabados a mano. Cada pieza se hace en tandas
          pequeñas, con materiales nobles y detalles únicos.
        </p>
      </header>

      <div className="products-page__toolbar">
        <div
          className="products-page__filters"
          role="tablist"
          aria-label="Filtrar por categoría"
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`products-page__filter${
                activeCategory === cat ? ' is-active' : ''
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-page__sort">
          <label htmlFor="sort">Ordenar:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='Input'
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="products-page__count">
        {products.length} {products.length === 1 ? 'producto' : 'productos'}
      </p>

      {products.length > 0 ? (
        <div className="products-page__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="products-page__empty">
          No hay productos en esta categoría todavía.
        </p>
      )}

      <div className="products-page__cta">
        <div>
          <p className="eyebrow">¿Buscás algo distinto?</p>
          <h2>Hacé tu grabado a medida.</h2>
          <p className="muted">
            Contanos tu idea y la hacemos realidad en joyas, madera, cuero o virolas.
          </p>
        </div>
        <a href="/servicios" className="btn btn--primary btn--lg">
          Ver servicios <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default Products;