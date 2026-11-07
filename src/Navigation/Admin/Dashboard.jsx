import { Link } from 'react-router-dom';
import { Package, Wrench, ShoppingBag, Users, ArrowRight, Plus } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useServices } from '../../context/ServicesContext';
import { formatPrice } from '../../utils/format';

const Dashboard = () => {
  const { products } = useProducts();
  const { services } = useServices();
  const lowStock = products.filter((product) => (product.stock ?? 99) <= 5).length;

  const stats = [
    { label: 'Productos', value: products.length, icon: Package, hint: `${lowStock} con stock bajo` },
    { label: 'Servicios', value: services.length, icon: Wrench, hint: 'Catálogo de la web' },
    { label: 'Pedidos', value: '—', icon: ShoppingBag, hint: 'Consultar portal interno' },
    { label: 'Usuarios', value: '—', icon: Users, hint: 'Sin cifras ficticias' },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <>
      <header className="admin-page-header">
        <div><h1>Dashboard</h1><p>Resumen del catálogo de Mattu.</p></div>
        <div className="admin-page-header__actions">
          <Link to="/admin/productos/nuevo" className="btn btn--primary btn--sm"><Plus size={14} /> Nuevo producto</Link>
        </div>
      </header>
      <div className="admin-stats">
        {stats.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="admin-stat">
            <span className="admin-stat__label"><Icon size={14} /> {label}</span>
            <span className="admin-stat__value">{value}</span>
            <span className="admin-stat__hint">{hint}</span>
          </div>
        ))}
      </div>
      <section className="admin-card">
        <div className="admin-card__header">
          <h2>Productos del catálogo</h2>
          <Link to="/admin/productos" className="quiet-link">Ver todos <ArrowRight size={14} /></Link>
        </div>
        <div className="admin-card__body">
          {recentProducts.length === 0 ? <p className="admin-empty">Todavía no hay productos cargados.</p> : (
            <table className="admin-table">
              <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead>
              <tbody>{recentProducts.map((product) => (
                <tr key={product.id}>
                  <td><div className="admin-table__product"><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>#{product.id}</span></div></div></td>
                  <td>{product.category}</td><td>{formatPrice(product.price)}</td><td>{product.stock ?? '—'}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
