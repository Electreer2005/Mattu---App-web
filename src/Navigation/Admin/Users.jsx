import { Users as UsersIcon, ExternalLink } from 'lucide-react';

const Users = () => (
  <>
    <header className="admin-page-header">
      <div>
        <h1>Usuarios</h1>
        <p>Las cuentas de clientes se almacenan en Cloudflare D1 y usan autenticación verificada por correo.</p>
      </div>
    </header>
    <div className="admin-empty">
      <UsersIcon size={32} />
      <p>La lista de clientes de administración no está habilitada en este panel. No se muestran usuarios de ejemplo.</p>
      <a className="btn btn--secondary" href="https://mattu-pedidos.solismauricioezequiel.workers.dev" target="_blank" rel="noreferrer">
        Abrir portal interno <ExternalLink size={15} />
      </a>
    </div>
  </>
);

export default Users;
