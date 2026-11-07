import { ShoppingBag, ExternalLink } from 'lucide-react';

const Orders = () => (
  <>
    <header className="admin-page-header">
      <div>
        <h1>Pedidos</h1>
        <p>Los pedidos reales se sincronizan en el portal interno de Mattu.</p>
      </div>
    </header>
    <div className="admin-empty">
      <ShoppingBag size={32} />
      <p>El panel de pedidos del equipo sigue siendo la fuente de gestión y sincronización.</p>
      <a className="btn btn--primary" href="https://mattu-pedidos.solismauricioezequiel.workers.dev" target="_blank" rel="noreferrer">
        Abrir portal de pedidos <ExternalLink size={15} />
      </a>
    </div>
  </>
);

export default Orders;
