import { useState } from 'react';
import { Users as UsersIcon, Search } from 'lucide-react';

const MOCK_USERS = [
  { id: 'u-1', name: 'Lucía Fernández', email: 'lucia@mail.com', role: 'user', joined: '2026-06-15' },
  { id: 'u-2', name: 'Martín Paz',     email: 'martin@mail.com', role: 'user', joined: '2026-07-02' },
  { id: 'u-3', name: 'Ana Sosa',       email: 'ana@mail.com',    role: 'user', joined: '2026-08-11' },
  { id: 'u-4', name: 'Admin Mattu',    email: 'admin@mattu.com', role: 'admin', joined: '2026-01-01' },
];

const Users = () => {
  const [query, setQuery] = useState('');
  const filtered = MOCK_USERS.filter((u) =>
    (u.name + u.email).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Usuarios</h1>
          <p>{MOCK_USERS.length} registrados (demo).</p>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar por nombre o email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <UsersIcon size={32} />
          <p>Sin resultados.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${u.role === 'admin' ? 'new' : 'muted'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Users;