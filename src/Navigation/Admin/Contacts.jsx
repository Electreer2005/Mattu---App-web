import { useCallback, useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, RefreshCw, Inbox } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

const STATUS = {
  new: 'Nueva',
  in_progress: 'En seguimiento',
  resolved: 'Resuelta',
};

const dateLabel = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Fecha no disponible'
    : new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');
  const [error, setError] = useState('');

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await customerApi('admin/contacts');
      setContacts(result.contacts || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las consultas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const changeStatus = async (contact, status) => {
    setUpdating(contact.id);
    setError('');
    try {
      await customerApi('admin/contacts', {
        method: 'PATCH',
        body: JSON.stringify({ id: contact.id, status }),
      });
      setContacts((current) => current.map((item) =>
        item.id === contact.id ? { ...item, status } : item
      ));
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado.');
    } finally {
      setUpdating('');
    }
  };

  const visible = contacts.filter((contact) => filter === 'all' || contact.status === filter);
  const pending = contacts.filter((contact) => contact.status !== 'resolved').length;

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Consultas</h1>
          <p>{contacts.length} recibidas · {pending} pendientes de resolver</p>
        </div>
        <div className="admin-page-header__actions">
          <button type="button" className="btn btn--secondary" onClick={loadContacts} disabled={loading}>
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrar consultas">
          <option value="all">Todos los estados</option>
          <option value="new">Nuevas</option>
          <option value="in_progress">En seguimiento</option>
          <option value="resolved">Resueltas</option>
        </select>
      </div>

      {error && <p className="admin-form__error" role="alert">{error}</p>}
      {loading ? (
        <div className="admin-empty"><RefreshCw size={28} /><p>Cargando consultas…</p></div>
      ) : visible.length === 0 ? (
        <div className="admin-empty"><Inbox size={32} /><p>{contacts.length ? 'No hay consultas con ese estado.' : 'Todavía no recibiste consultas desde el sitio.'}</p></div>
      ) : (
        <div className="admin-contact-list">
          {visible.map((contact) => (
            <article className="admin-contact-card" key={contact.id}>
              <div className="admin-contact-card__head">
                <div>
                  <strong>{contact.name}</strong>
                  <div className="admin-contact-card__meta">
                    <span>{dateLabel(contact.created_at)}</span>
                    <span>{contact.email || 'Sin correo informado'}</span>
                  </div>
                </div>
                <span className={`admin-badge ${contact.status === 'new' ? 'admin-badge--new' : contact.status === 'resolved' ? 'admin-badge--success' : 'admin-badge--custom'}`}>
                  {STATUS[contact.status] || 'Nueva'}
                </span>
              </div>
              <div className="admin-contact-card__meta">
                <a href={`tel:${contact.phone}`}><Phone size={13} /> {contact.phone}</a>
                {contact.email && <a href={`mailto:${contact.email}`}><Mail size={13} /> Responder por correo</a>}
              </div>
              <p className="admin-contact-card__message">{contact.message}</p>
              <div className="admin-contact-card__actions">
                <MessageSquare size={15} />
                <label htmlFor={`contact-status-${contact.id}`}>Estado</label>
                <select
                  id={`contact-status-${contact.id}`}
                  value={contact.status}
                  onChange={(event) => changeStatus(contact, event.target.value)}
                  disabled={updating === contact.id}
                >
                  <option value="new">Nueva</option>
                  <option value="in_progress">En seguimiento</option>
                  <option value="resolved">Resuelta</option>
                </select>
                {updating === contact.id && <span>Guardando…</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
