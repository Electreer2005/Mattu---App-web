import { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, ShoppingBag, Users,
  Settings as SettingsIcon, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/servicios', label: 'Servicios', icon: Wrench },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/configuracion', label: 'Configuración', icon: SettingsIcon },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  const currentLabel =
    NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))
      ?.label ?? 'Admin';

  return (
    <div className="admin-shell" data-sidebar={open ? 'open' : 'closed'}>
      <aside className="admin-sidebar" aria-label="Navegación admin">
        <div className="admin-sidebar__brand">
          <Link to="/admin">
            <span className="admin-sidebar__logo">M</span>
            <span>Mattu · Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' is-active' : ''}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__link" target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            <span>Ver sitio</span>
          </Link>
          <button
            type="button"
            className="admin-sidebar__link admin-sidebar__link--danger"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div
        className="admin-backdrop"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="admin-topbar__breadcrumb">
            <span>Admin</span>
            <span aria-hidden="true">/</span>
            <strong>{currentLabel}</strong>
          </div>

          <div className="admin-topbar__user">
            <div className="admin-topbar__avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                (user?.name || 'A').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;