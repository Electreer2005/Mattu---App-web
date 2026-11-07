import { NavLink } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Gem,
  User,
  ShoppingBag,
} from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio', end: true },
  { to: '/servicios', icon: Sparkles, label: 'Servicios' },
  { to: '/productos', icon: Gem, label: 'Productos' },
  { to: '/mis-pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { to: '/perfil', icon: User, label: 'Perfil' },
];

const BottomNav = () => {
  return (
    <nav className="BottomNav" aria-label="Navegación principal">
      {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `BottomNav__item${isActive ? ' is-active' : ''}`
          }
        >
          <span className="BottomNav__icon">
            <Icon size={22} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="BottomNav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
