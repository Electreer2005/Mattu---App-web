import { useMemo, useState } from 'react';
import { Search, Menu, ArrowUpRight, X } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { useServices } from '../../context/ServicesContext';
import './Header.css';

const normalize = (value = '') =>
  String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const Header = ({ onMenuClick, isMenuOpen = false }) => {
  const { totalItems } = useCart();
  const { products } = useProducts();
  const { services } = useServices();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (term.length < 2) return [];

    const productResults = products
      .filter((product) => product.active !== false && product.visible !== false)
      .filter((product) => normalize([
        product.name, product.category, product.description, product.material,
        ...(product.features || []), ...(product.tags || []),
      ].join(' ')).includes(term))
      .map((product) => ({
        id: product.id,
        title: product.name,
        detail: product.category || 'Producto',
        image: product.image || product.images?.[0]?.src,
        to: `/productos/${product.id}`,
        type: 'Producto',
      }));

    const serviceResults = services
      .filter((service) => service.active !== false && service.visible !== false)
      .filter((service) => normalize([
        service.title, service.category, service.description, service.detail,
        ...(service.pieces || []),
      ].join(' ')).includes(term))
      .map((service) => ({
        id: service.slug,
        title: service.title,
        detail: service.category || 'Servicio',
        image: service.image,
        to: `/servicios/${service.slug}`,
        type: 'Servicio',
      }));

    return [...productResults, ...serviceResults].slice(0, 7);
  }, [products, services, query]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/productos?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
      document.activeElement?.blur?.();
    }
  };

  const closeSearch = () => setIsSearchOpen(false);

  return (
    <header className="header">
      <button
        type="button"
        className="Header__menu-btn"
        onClick={onMenuClick}
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isMenuOpen}
        aria-controls="main-sidebar"
      >
        <Menu />
      </button>

      <div className="header-content">
        <div className="Logo-container">
          <Link to="/" aria-label="Mattu, inicio" onClick={closeSearch}>
            <img src={Logo} alt="Mattu" className="Logo-img" />
          </Link>
        </div>

        <div className="Search-container">
          <form className="Search-form" role="search" onSubmit={submitSearch}>
            <Search aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar productos, materiales, grabados..."
              className="Search-input"
              aria-label="Buscar en todo Mattu"
              aria-expanded={isSearchOpen && query.trim().length >= 2}
              aria-controls="global-search-results"
              aria-autocomplete="list"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') closeSearch();
                if (event.key === 'Enter' && results.length === 1) {
                  event.preventDefault();
                  navigate(results[0].to);
                  closeSearch();
                }
              }}
            />
            {query && (
              <button
                type="button"
                className="Search-clear"
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {isSearchOpen && query.trim().length >= 2 && (
            <div className="Search-results" id="global-search-results" role="listbox">
              {results.length ? (
                <>
                  <p className="Search-results__heading">Resultados en Mattu</p>
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={result.to}
                      className="Search-result"
                      role="option"
                      aria-selected="false"
                      onClick={closeSearch}
                    >
                      <span className="Search-result__image">
                        {result.image ? <img src={result.image} alt="" /> : <Search size={17} />}
                      </span>
                      <span className="Search-result__copy">
                        <strong>{result.title}</strong>
                        <small>{result.type} · {result.detail}</small>
                      </span>
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                  <button type="button" className="Search-results__all" onClick={submitSearch}>
                    Ver todos los resultados <ArrowUpRight size={15} />
                  </button>
                </>
              ) : (
                <div className="Search-empty">
                  <strong>No encontramos coincidencias</strong>
                  <span>Probá con otro nombre, material o tipo de grabado.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="Cart-container">
          <Link
            to="/carrito"
            className="btn btn--secondary"
            aria-label={`Ver carrito (${totalItems} items)`}
            onClick={closeSearch}
          >
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="Cart-count" aria-hidden="true">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      {isSearchOpen && <button className="Search-backdrop" type="button" aria-label="Cerrar búsqueda" onClick={closeSearch} />}
    </header>
  );
};

export default Header;