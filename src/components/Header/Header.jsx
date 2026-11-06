import { Search, Menu } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = ({ onMenuClick, isMenuOpen = false }) => {
  const { totalItems } = useCart();

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
          <Link to="/" aria-label="Mattu, inicio">
            <img src={Logo} alt="Mattu" className="Logo-img" />
          </Link>
        </div>

        <div className="Search-container">
          <input
            type="search"
            placeholder="Buscar..."
            className="Search-input"
            aria-label="Buscar productos"
          />
          <Search />
        </div>

        <div className="Cart-container">
          <Link
            to="/carrito"
            className="btn btn--secondary"
            aria-label={`Ver carrito (${totalItems} items)`}
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
    </header>
  );
};

export default Header;