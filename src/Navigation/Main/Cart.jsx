import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { customerApi } from '../../services/customerApi';
import { formatPrice } from '../../utils/format';

const Cart = () => {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestKey = useRef(null);

  const handleCheckout = async () => {
    if (!phone.trim()) {
      toast('Ingresá un teléfono para que podamos contactarte', { type: 'error' });
      return;
    }

    requestKey.current ||= crypto.randomUUID();
    setIsSubmitting(true);
    try {
      const result = await customerApi('orders', {
        method: 'POST',
        body: JSON.stringify({
          requestKey: requestKey.current,
          phone,
          notes,
          items: items.map((item) => ({
            serviceId: item.serviceId || undefined,
            productName: item.serviceId ? undefined : item.name,
            name: item.name,
            piece: item.piece || item.name,
            material: item.material || item.category || '',
            design: item.design || item.customization || item.description || 'Personalización a coordinar con Mattu',
            qty: item.qty,
          })),
        }),
      });
      clearCart();
      requestKey.current = null;
      toast(`Solicitud ${result.number || ''} enviada correctamente`, { type: 'success' });
      navigate('/mis-pedidos');
    } catch (error) {
      toast(error.message, { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('¿Vaciar la solicitud?')) {
      clearCart();
      requestKey.current = null;
      toast('Solicitud vaciada', { type: 'info' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <div className="cart-page__empty-icon"><ShoppingBag size={48} aria-hidden="true" /></div>
        <h1>Tu solicitud está vacía</h1>
        <p className="muted">Explorá la tienda o armá un grabado personalizado.</p>
        <div className="cart-page__empty-actions">
          <Link to="/productos" className="btn btn--primary">Ver productos <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link to="/servicios" className="btn btn--secondary">Grabados a medida</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <div>
          <p className="eyebrow">Mi solicitud</p>
          <h1>{totalItems} {totalItems === 1 ? 'pieza' : 'piezas'} en tu carrito</h1>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={handleClear}>
          <Trash2 size={14} aria-hidden="true" /> Vaciar
        </button>
      </header>

      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <Link to={item.serviceId ? '/servicios' : `/productos/${item.id}`} className="cart-item__media">
                <img src={item.image} alt={item.alt || item.name} />
              </Link>
              <div className="cart-item__info">
                <span className="cart-item__category">{item.category}</span>
                <span className="cart-item__name">{item.name}</span>
                {item.customization && <p className="cart-item__unit">Personalización: {item.customization}</p>}
                {item.design && <p className="cart-item__unit">Detalle: {item.design}</p>}
                {item.price > 0 && <p className="cart-item__unit">{formatPrice(item.price)} c/u</p>}
              </div>
              <div className="cart-item__controls">
                <div className="cart-item__qty" role="group" aria-label="Cantidad">
                  <button type="button" className="cart-item__qty-btn" onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Restar"><Minus size={14} /></button>
                  <span className="cart-item__qty-value">{item.qty}</span>
                  <button type="button" className="cart-item__qty-btn" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Sumar"><Plus size={14} /></button>
                </div>
                {item.price > 0 && <span className="cart-item__subtotal">{formatPrice(item.price * item.qty)}</span>}
                <button type="button" className="cart-item__remove" onClick={() => { removeItem(item.id); toast(`${item.name} eliminado`, { type: 'info' }); }} aria-label={`Quitar ${item.name}`}><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Enviar solicitud</h2>
          <p className="cart-summary__note">El equipo revisará tu pedido y te confirmará presupuesto, disponibilidad y entrega.</p>
          <div className="form-group">
            <label htmlFor="checkout-phone" className="form-label">Teléfono de contacto *</label>
            <input id="checkout-phone" className="Input" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+54 351 ..." autoComplete="tel" required />
          </div>
          <div className="form-group">
            <label htmlFor="checkout-notes" className="form-label">Comentarios (opcional)</label>
            <textarea id="checkout-notes" className="Input" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} placeholder="Detalles adicionales para el equipo..." />
          </div>
          <dl className="cart-summary__lines">
            <div><dt>Piezas</dt><dd>{totalItems}</dd></div>
            <div><dt>Presupuesto</dt><dd className="muted">A confirmar</dd></div>
          </dl>
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={handleCheckout} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando solicitud...' : <>Enviar solicitud <ArrowRight size={16} aria-hidden="true" /></>}
          </button>
          <p className="cart-summary__note">Al enviarla, recibirás un correo de confirmación y podrás seguir el estado desde Mis pedidos.</p>
          <Link to="/productos" className="cart-summary__continue">Seguir comprando</Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
