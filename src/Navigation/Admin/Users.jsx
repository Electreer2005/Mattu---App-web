import { useCallback, useEffect, useState } from 'react';
import { Users as UsersIcon, RefreshCw, ShieldCheck, Crown } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await customerApi('admin/users');
      setUsers(result.users || []);
      setIsOwner(Boolean(result.isOwner));
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const changeRole = async (user, role) => {
    if (!isOwner || user.is_owner || user.role === role) return;
    const action = role === 'admin' ? 'dar permisos de administrador a' : 'quitar los permisos de administrador a';
    if (!window.confirm(`¿Querés ${action} ${user.email}?`)) return;

    setSavingId(user.id);
    setError('');
    setNotice('');
    try {
      await customerApi('admin/role', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, role }),
      });
      setNotice(`Se actualizó el rol de ${user.email}. El cambio se aplicará en su próxima consulta de sesión.`);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el rol.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Administrá los permisos de las cuentas registradas en Mattu.</p>
        </div>
        <button className="btn btn--secondary" type="button" onClick={loadUsers} disabled={loading}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </header>
      {isOwner && <p className="admin-empty"><Crown size={16} /> Sos el administrador principal. Solo tu cuenta puede modificar roles.</p>}
      {!isOwner && !loading && <p className="admin-empty"><ShieldCheck size={16} /> Podés consultar usuarios. Los cambios de permisos están reservados al administrador principal.</p>}
      {error && <div className="auth-error" role="alert">{error}</div>}
      {notice && <div className="admin-empty" role="status">{notice}</div>}
      {loading ? <div className="admin-empty">Cargando usuarios…</div> : users.length === 0 ? (
        <div className="admin-empty"><UsersIcon size={32} /><p>Todavía no hay usuarios registrados.</p></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Verificación</th></tr></thead>
            <tbody>{users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}{user.is_owner && <span className="status-badge status-badge--success">Principal</span>}</td>
                <td>{user.email}</td>
                <td>
                  {user.is_owner ? <span className="status-badge status-badge--success">Administrador principal</span> : isOwner ? (
                    <select aria-label={`Rol de ${user.email}`} value={user.role} disabled={savingId === user.id || !user.verified_at} onChange={(event) => changeRole(user, event.target.value)}>
                      <option value="customer">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  ) : <span className={user.role === 'admin' ? 'status-badge status-badge--success' : 'status-badge'}>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>}
                </td>
                <td>{user.verified_at ? 'Verificado' : 'Pendiente'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}