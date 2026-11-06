import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, ExternalLink, Shield } from 'lucide-react';

const Settings = () => (
  <>
    <header className="admin-page-header">
      <div>
        <h1>Configuración del admin</h1>
        <p>Ajustes generales del panel.</p>
      </div>
    </header>

    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Accesos rápidos</h2>
      </div>
      <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link to="/" target="_blank" rel="noreferrer" className="admin-sidebar__link" style={{ color: 'var(--text)', background: 'var(--bg-subtle)' }}>
          <ExternalLink size={18} /> Ver sitio público
        </Link>
        <button type="button" className="admin-sidebar__link" style={{ color: 'var(--text)', background: 'var(--bg-subtle)', textAlign: 'left' }}>
          <Shield size={18} /> Políticas y roles
        </button>
        <p style={{ margin: 'var(--space-3) 0 0', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
          <SettingsIcon size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Los cambios de configuración de tienda se guardan desde el panel de productos y servicios.
        </p>
      </div>
    </div>
  </>
);

export default Settings;