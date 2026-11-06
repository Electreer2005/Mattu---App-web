import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Wrench } from 'lucide-react';
import { useServices } from '../../context/ServicesContext';
import { useToast } from '../../context/ToastContext';

const Services = () => {
  const { services, deleteService } = useServices();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (s) => {
    if (!window.confirm(`¿Eliminar "${s.title}"?`)) return;
    deleteService(s.slug);
    toast('Servicio eliminado', { type: 'info' });
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Servicios</h1>
          <p>{services.length} en total.</p>
        </div>
        <div className="admin-page-header__actions">
          <Link to="/admin/servicios/nuevo" className="btn btn--primary">
            <Plus size={16} /> Nuevo servicio
          </Link>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar por título…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <Wrench size={32} />
          <p>No hay servicios que coincidan.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Categoría</th>
                <th>Slug</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.slug}>
                  <td>
                    <div className="admin-table__product">
                      <img src={s.image} alt="" />
                      <div>
                        <strong>{s.title}</strong>
                        <span>{s.description}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge--muted">{s.category}</span></td>
                  <td><code style={{ fontSize: 'var(--fs-xs)' }}>{s.slug}</code></td>
                  <td>
                    <div className="admin-table__actions">
                      <Link to={`/admin/servicios/${s.slug}`} className="admin-icon-btn" aria-label="Editar">
                        <Pencil size={14} />
                      </Link>
                      <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(s)} aria-label="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Services;