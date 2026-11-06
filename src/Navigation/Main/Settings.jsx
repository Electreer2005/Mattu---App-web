import { useEffect, useState } from 'react';
import {
  Moon, Sun, Bell, Mail, Megaphone, Shield, Eye,
  Trash2, LogOut, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STORAGE_KEY = 'matu:settings';

const getInitialSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* noop */ }
  return {
    darkMode:
      typeof document !== 'undefined' &&
      document.documentElement.dataset.theme === 'dark',
    emailNotif: true,
    pushNotif: false,
    newsletter: true,
    publicProfile: false,
  };
};

const Settings = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getInitialSettings);

  /* Persistencia + aplicación del tema */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.dataset.theme = settings.darkMode ? 'dark' : '';
  }, [settings]);

  const toggle = (key) => () =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    logout();
    toast('Sesión cerrada', { type: 'info' });
    navigate('/');
  };

  const handleDeleteAccount = () => {
    const ok = window.confirm(
      '¿Eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!ok) return;
    toast('Cuenta eliminada (simulado)', { type: 'info' });
    logout();
    navigate('/');
  };

  return (
    <div className="Settings-page">
      <header className="Settings-header">
        <h1>Configuración</h1>
        <p>Personalizá tu experiencia en MATU.</p>
      </header>

      {/* ---------- Apariencia ---------- */}
      <section className="Settings-group">
        <h2 className="Settings-group-title">Apariencia</h2>

        <div className="Settings-row">
          <div className="Settings-row-info">
            <span className="Settings-row-icon">
              {settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </span>
            <div>
              <p className="Settings-row-label">Modo oscuro</p>
              <p className="Settings-row-hint">
                Cambia la paleta a tonos cálidos oscuros.
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={toggle('darkMode')}
              aria-label="Modo oscuro"
            />
            <span className="toggle__slider" />
          </label>
        </div>
      </section>

      {/* ---------- Notificaciones ---------- */}
      <section className="Settings-group">
        <h2 className="Settings-group-title">Notificaciones</h2>

        <div className="Settings-row">
          <div className="Settings-row-info">
            <span className="Settings-row-icon"><Mail size={18} /></span>
            <div>
              <p className="Settings-row-label">Emails de pedidos</p>
              <p className="Settings-row-hint">
                Estado de tus compras y envíos.
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.emailNotif}
              onChange={toggle('emailNotif')}
            />
            <span className="toggle__slider" />
          </label>
        </div>

        <div className="Settings-row">
          <div className="Settings-row-info">
            <span className="Settings-row-icon"><Bell size={18} /></span>
            <div>
              <p className="Settings-row-label">Notificaciones push</p>
              <p className="Settings-row-hint">
                Avisos en el navegador (requiere permiso).
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.pushNotif}
              onChange={toggle('pushNotif')}
            />
            <span className="toggle__slider" />
          </label>
        </div>

        <div className="Settings-row">
          <div className="Settings-row-info">
            <span className="Settings-row-icon"><Megaphone size={18} /></span>
            <div>
              <p className="Settings-row-label">Newsletter</p>
              <p className="Settings-row-hint">
                Novedades, lanzamientos y descuentos.
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.newsletter}
              onChange={toggle('newsletter')}
            />
            <span className="toggle__slider" />
          </label>
        </div>
      </section>

      {/* ---------- Privacidad ---------- */}
      <section className="Settings-group">
        <h2 className="Settings-group-title">Privacidad</h2>

        <div className="Settings-row">
          <div className="Settings-row-info">
            <span className="Settings-row-icon"><Eye size={18} /></span>
            <div>
              <p className="Settings-row-label">Perfil público</p>
              <p className="Settings-row-hint">
                Otros usuarios pueden ver tu nombre y foto.
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={toggle('publicProfile')}
            />
            <span className="toggle__slider" />
          </label>
        </div>

        <button type="button" className="Settings-link">
          <span className="Settings-row-info">
            <span className="Settings-row-icon"><Shield size={18} /></span>
            <div>
              <p className="Settings-row-label">Política de privacidad</p>
              <p className="Settings-row-hint">Leer el documento completo</p>
            </div>
          </span>
          <ChevronRight size={18} />
        </button>
      </section>

      {/* ---------- Cuenta ---------- */}
      <section className="Settings-group">
        <h2 className="Settings-group-title">Cuenta</h2>

        <button type="button" className="Settings-link" onClick={handleLogout}>
          <span className="Settings-row-info">
            <span className="Settings-row-icon"><LogOut size={18} /></span>
            <div>
              <p className="Settings-row-label">Cerrar sesión</p>
              <p className="Settings-row-hint">Salir de tu cuenta actual</p>
            </div>
          </span>
          <ChevronRight size={18} />
        </button>

        <button
          type="button"
          className="Settings-link Settings-link--danger"
          onClick={handleDeleteAccount}
        >
          <span className="Settings-row-info">
            <span className="Settings-row-icon"><Trash2 size={18} /></span>
            <div>
              <p className="Settings-row-label">Eliminar cuenta</p>
              <p className="Settings-row-hint">
                Esta acción es permanente e irreversible.
              </p>
            </div>
          </span>
          <ChevronRight size={18} />
        </button>
      </section>
    </div>
  );
};

export default Settings;