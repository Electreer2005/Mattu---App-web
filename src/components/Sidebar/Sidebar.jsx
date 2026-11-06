import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Gem,
  User,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logo.png';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Iniciales como fallback cuando no hay foto
  const initials = (user?.name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`Sidebar-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="main-sidebar"
        className={`Sidebar ${isOpen ? 'is-open' : ''}`}
      >
        <header className="header-sidebar">
          <button
            type="button"
            className="Sidebar-close btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ×
          </button>

          <div className="Logo-container">
            <img src={Logo} alt="Mattu" className="Logo-img" />
            <h1>Mattu</h1>
          </div>
        </header>

        <div className="NavBar">
          <nav>
            <ul>
              <li>
                <Link to="/" onClick={onClose}>
                  <Home size={18} aria-hidden="true" />
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/servicios" onClick={onClose}>
                  <Sparkles size={18} aria-hidden="true" />
                  <span>Servicios</span>
                </Link>
              </li>
              <li>
                <Link to="/productos" onClick={onClose}>
                  <Gem size={18} aria-hidden="true" />
                  <span>Productos</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <Link to="/perfil" className="Profile-container" onClick={onClose}>
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`Foto de ${user.name || 'usuario'}`}
                loading="lazy"
              />
            ) : initials ? (
              <span className="profile-avatar__initials">{initials}</span>
            ) : (
              <User size={20} aria-hidden="true" />
            )}
          </div>

          <div className="profile-info">
            <h2>{user?.name || 'Nombre de Usuario'}</h2>
            <p>{user?.email || 'usuario@example.com'}</p>
          </div>

          <ChevronRight size={18} className="profile-chevron" aria-hidden="true" />
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;