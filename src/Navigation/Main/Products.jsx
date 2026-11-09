import { useMemo, useState, useEffect } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { PRODUCT_CATEGORIES } from '../../data/products';
import { useProducts } from '../../context/ProductsContext';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'name', label: 'Nombre A–Z' },
];

const normalize = (value = '') =>
  String(value).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();

const Products = () => {
  const { products: allProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (query) setActiveCategory('Todos');
  }, [query]);

  const products = useMemo(() => {
    const term = normalize(query.trim());
    let result = allProducts.filter((product) =>
      product.active !== false && product.visible !== false
    );

    if (activeCategory !== 'Todos') {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (term) {
      result = result.filter((product) => normalize([
        product.name, product.category, product.description, product.material,
        ...(product.features || []), ...(product.tags || []),
      ].join(' ')).includes(term));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, activeCategory, sortBy, query]);

  const clearSearch = () => setSearchParams({});

  return (
    <div className="products-page">
      <header className="products-page__header">
        <p className="eyebrow">Tienda Mattu</p>
        <h1>{query ? 'Resultados de búsqueda' : 'Piezas listas para llevar'}</h1>
        <p className="products-page__intro">
          {query
            ? <>Buscamos coincidencias para <strong>“{query}”</strong> en nuestro catálogo.</>
            : 'Joyas y objetos grabados a mano. Cada pieza se hace en tandas pequeñas, con materiales nobles y detalles únicos.'}
        </p>
      </header>

      {query && (
        <div className="products-page__search-summary">
          <span><Search size={15} /> {products.length} resultados para “{query}”</span>
          <button type="button" onClick={clearSearch}>Limpiar búsqueda</button>
        </div>
      )}

      <div className="products-page__toolbar">
        <div className="products-page__filters" role="tablist" aria-label="Filtrar por categoría">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`products-page__filter${activeCategory === cat ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-page__sort">
          <label htmlFor="sort"><SlidersHorizontal size={15} /> Ordenar:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="Input">
            {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <p className="products-page__count">
        {products.length} {products.length === 1 ? 'producto' : 'productos'}
      </p>

      {products.length > 0 ? (
        <div className="products-page__grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="products-page__empty-state">
          <span className="products-page__empty-icon"><Search size={22} /></span>
          <h2>No encontramos productos</h2>
          <p>{query ? 'Probá con otra palabra o revisá las categorías disponibles.' : 'No hay productos en esta categoría todavía.'}</p>
          {query && <button type="button" className="btn btn--secondary" onClick={clearSearch}>Ver todo el catálogo</button>}
        </div>
      )}

      <div className="products-page__cta">
        <div>
          <p className="eyebrow">¿Buscás algo distinto?</p>
          <h2>Hacé tu grabado a medida.</h2>
          <p className="muted">Contanos tu idea y la hacemos realidad en joyas, madera, cuero o virolas.</p>
        </div>
        <Link to="/servicios" className="btn btn--primary btn--lg">
          Ver servicios <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default Products;