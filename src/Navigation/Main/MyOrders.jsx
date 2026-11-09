import { useCallback, useEffect, useState } from 'react';
import { Package, RefreshCw, Clock3 } from 'lucide-react';
import { customerApi } from '../../services/customerApi';
import { formatPrice } from '../../utils/format';
import './MyOrders.css';

const statusLabels = {
  Recibido: 'Recibido',
  Presupuestando: 'Presupuestando',
  Aprobado: 'Aprobado',
  'En elaboración': 'En elaboración',
  Preparando: 'Preparando',
  Listo: 'Listo',
  Enviado: 'Enviado',
  Entregado: 'Entregado',
  Cancelado: 'Cancelado',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await customerApi('orders');
      setOrders(result.orders || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = window.setInterval(() => loadOrders(true), 15000);
    return () => window.clearInterval(interval);
  }, [loadOrders]);

  return (
    <section className="my-orders-page">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">Tu cuenta Mattu</p>
          <h1>Mis pedidos</h1>
          <p>Consultá el estado de tus solicitudes. Se actualiza automáticamente.</p>
        </div>
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => loadOrders()} disabled={loading}>
          <RefreshCw size={15} /> Actualizar
        </button>
      </header>

      {error && <div className="auth-error" role="alert">{error}</div>}
      {loading ? (
        <div className="admin-empty"><Clock3 size={28} /><p>Cargando tus pedidos...</p></div>
      ) : orders.length === 0 ? (
        <div className="admin-empty"><Package size={32} /><p>Todavía no tenés solicitudes.</p></div>
      ) : (
        <div className="my-orders-list">
          {orders.map((order) => (
            <article className="admin-card" key={order.id}>
              <div className="admin-card__header">
                <div>
                  <strong>{order.number || order.id}</strong>
                  <p>{new Date(order.createdAt).toLocaleDateString('es-AR', { dateStyle: 'medium' })}</p>
                  {order.webType && <small className="my-orders-type">{order.webType === 'product' ? 'Compra web' : order.webType === 'mixed' ? 'Compra mixta' : 'Solicitud web'}</small>}
                </div>
                <span className={`admin-badge admin-badge--${order.status === 'Entregado' ? 'success' : order.status === 'Cancelado' ? 'sale' : 'new'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="admin-card__body">
                {order.items?.map((item, index) => (
                  <div className="my-orders-item" key={index}>
                    <span>{item.description}</span>
                    <span>{item.qty} × {formatPrice(item.price || 0)}</span>
                  </div>
                ))}
                <div className="my-orders-item">
                  <strong>Seña registrada</strong>
                  <strong>{formatPrice(order.deposit || 0)}</strong>
                </div>
                {order.due && <p>Entrega estimada: {new Date(order.due).toLocaleDateString('es-AR')}</p>}
                {order.pendingReview && <p className="cart-summary__note">Tu solicitud fue recibida. El equipo está revisando los detalles y te contactará con el presupuesto.</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
