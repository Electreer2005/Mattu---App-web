import { useCallback, useEffect, useState } from 'react';
import { Users as UsersIcon, RefreshCw } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await customerApi('admin/users');
      setUsers(result.users || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Cuentas registradas en Mattu y sus permisos actuales.</p>
        </div>
        <button className="btn btn--secondary" type="button" onClick={loadUsers} disabled={loading}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </header>
      {error && <div className="auth-error" role="alert">{error}</div>}
      {loading ? <div className="admin-empty">Cargando usuarios…</div> : users.length === 0 ? (
        <div className="admin-empty"><UsersIcon size={32} /><p>Todavía no hay usuarios registrados.</p></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Verificación</th></tr></thead>
            <tbody>{users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={user.role === 'admin' ? 'status-badge status-badge--success' : 'status-badge'}>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span></td>
                <td>{user.verified_at ? 'Verificado' : 'Pendiente'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
