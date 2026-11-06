import { Link } from 'react-router-dom';
import { Package, Wrench, ShoppingBag, Users, ArrowRight, Plus } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useServices } from '../../context/ServicesContext';
import { formatPrice } from '../../utils/format';

const MOCK_ORDERS = 24;
const MOCK_USERS = 138;

const Dashboard = () => {
  const { products } = useProducts();
  const { services } = useServices();

  const lowStock = products.filter((p) => (p.stock ?? 99) <= 5).length;

  const stats = [
    { label: 'Productos', value: products.length, icon: Package, hint: `${lowStock} con stock bajo` },
    { label: 'Servicios', value: services.length, icon: Wrench, hint: 'Activos en el sitio' },
    { label: 'Pedidos', value: MOCK_ORDERS, icon: ShoppingBag, hint: 'Últimos 30 días' },
    { label: 'Usuarios', value: MOCK_USERS, icon: Users, hint: 'Registrados' },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen rápido de tu tienda.</p>
        </div>
        <div className="admin-page-header__actions">
          <Link to="/admin/productos/nuevo" className="btn btn--primary btn--sm">
            <Plus size={14} /> Nuevo producto
          </Link>
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
          <h2>Productos recientes</h2>
          <Link to="/admin/productos" className="quiet-link">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="admin-card__body">
          {recentProducts.length === 0 ? (
            <p className="admin-empty">No hay productos todavía.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table__product">
                        <img src={p.image} alt="" />
                        <div>
                          <strong>{p.name}</strong>
                          <span>#{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.stock ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;