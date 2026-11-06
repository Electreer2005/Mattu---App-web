import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/format';

const MOCK_ORDERS = [
  { id: 'ORD-1024', customer: 'Lucía Fernández', email: 'lucia@mail.com', total: 24500, status: 'pending', date: '2026-11-04' },
  { id: 'ORD-1023', customer: 'Martín Paz',     email: 'martin@mail.com', total: 8700,  status: 'paid',    date: '2026-11-03' },
  { id: 'ORD-1022', customer: 'Ana Sosa',       email: 'ana@mail.com',    total: 42000, status: 'shipped', date: '2026-11-02' },
  { id: 'ORD-1021', customer: 'Diego Ríos',     email: 'diego@mail.com',  total: 3200,  status: 'cancelled', date: '2026-11-01' },
];

const STATUS_LABELS = {
  pending: { label: 'Pendiente', tone: 'warning' },
  paid: { label: 'Pagado', tone: 'success' },
  shipped: { label: 'Enviado', tone: 'new' },
  cancelled: { label: 'Cancelado', tone: 'sale' },
};

const Orders = () => {
  const [status, setStatus] = useState('todos');
  const filtered = status === 'todos'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === status);

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Historial de órdenes (demo).</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar estado">
          <option value="todos">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([k, { label }]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </header>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <ShoppingBag size={32} />
          <p>No hay pedidos con ese estado.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>
                    <strong>{o.customer}</strong>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{o.email}</div>
                  </td>
                  <td>{o.date}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${STATUS_LABELS[o.status].tone}`}>
                      {STATUS_LABELS[o.status].label}
                    </span>
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

export default Orders;