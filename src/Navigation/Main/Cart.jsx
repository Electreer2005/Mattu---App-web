import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/format';

const Cart = () => {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } =
    useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    // TODO: conectar con backend / WhatsApp
    toast('Te vamos a contactar para coordinar el pago', { type: 'info' });
  };

  const handleClear = () => {
    if (window.confirm('¿Vaciar la solicitud?')) {
      clearCart();
      toast('Solicitud vaciada', { type: 'info' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <div className="cart-page__empty-icon">
          <ShoppingBag size={48} aria-hidden="true" />
        </div>
        <h1>Tu solicitud está vacía</h1>
        <p className="muted">
          Explorá la tienda o armá un grabado personalizado.
        </p>
        <div className="cart-page__empty-actions">
          <Link to="/productos" className="btn btn--primary">
            Ver productos <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/servicios" className="btn btn--secondary">
            Grabados a medida
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <div>
          <p className="eyebrow">Mi solicitud</p>
          <h1>
            {totalItems} {totalItems === 1 ? 'pieza' : 'piezas'} en tu carrito
          </h1>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={handleClear}
        >
          <Trash2 size={14} aria-hidden="true" /> Vaciar
        </button>
      </header>

      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <Link to={`/productos/${item.id}`} className="cart-item__media">
                <img src={item.image} alt={item.alt} />
              </Link>

              <div className="cart-item__info">
                <span className="cart-item__category">{item.category}</span>
                <Link
                  to={`/productos/${item.id}`}
                  className="cart-item__name"
                >
                  {item.name}
                </Link>
                <p className="cart-item__unit">
                  {formatPrice(item.price)} c/u
                </p>
              </div>

              <div className="cart-item__controls">
                <div className="cart-item__qty" role="group" aria-label="Cantidad">
                  <button
                    type="button"
                    className="cart-item__qty-btn"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    aria-label="Restar"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="cart-item__qty-value">{item.qty}</span>
                  <button
                    type="button"
                    className="cart-item__qty-btn"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label="Sumar"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="cart-item__subtotal">
                  {formatPrice(item.price * item.qty)}
                </span>

                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => {
                    removeItem(item.id);
                    toast(`${item.name} eliminado`, { type: 'info' });
                  }}
                  aria-label={`Quitar ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Resumen</h2>

          <dl className="cart-summary__lines">
            <div>
              <dt>Productos</dt>
              <dd>{totalItems}</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd className="muted">A coordinar</dd>
            </div>
          </dl>

          <div className="cart-summary__total">
            <span>Total</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={handleCheckout}
          >
            Enviar solicitud <ArrowRight size={16} aria-hidden="true" />
          </button>

          <p className="cart-summary__note">
            Te vamos a contactar para confirmar disponibilidad, forma de pago y envío.
          </p>

          <Link to="/productos" className="cart-summary__continue">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;