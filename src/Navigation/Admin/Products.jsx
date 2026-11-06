import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/format';

const BADGE_LABELS = { new: 'Nuevo', sale: 'Oferta', custom: 'Grabado', soldout: 'Agotado' };

const Products = () => {
  const { products, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');
  const [badge, setBadge] = useState('todos');

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== 'todas' && p.category !== category) return false;
      if (badge !== 'todos' && p.badge !== badge) return false;
      return true;
    });
  }, [products, query, category, badge]);

  const handleDelete = (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"?`)) return;
    deleteProduct(p.id);
    toast('Producto eliminado', { type: 'info' });
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Productos</h1>
          <p>{products.length} en total.</p>
        </div>
        <div className="admin-page-header__actions">
          <Link to="/admin/productos/nuevo" className="btn btn--primary">
            <Plus size={16} /> Nuevo producto
          </Link>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar por nombre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filtrar por categoría">
          <option value="todas">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={badge} onChange={(e) => setBadge(e.target.value)} aria-label="Filtrar por estado">
          <option value="todos">Todos los estados</option>
          {Object.entries(BADGE_LABELS).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <Package size={32} />
          <p>No hay productos que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
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
                  <td>
                    {formatPrice(p.price)}
                    {p.oldPrice && (
                      <span style={{ marginLeft: 6, color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.8em' }}>
                        {formatPrice(p.oldPrice)}
                      </span>
                    )}
                  </td>
                  <td>{p.stock ?? '—'}</td>
                  <td>
                    {p.badge ? (
                      <span className={`admin-badge admin-badge--${p.badge}`}>
                        {BADGE_LABELS[p.badge]}
                      </span>
                    ) : (
                      <span className="admin-badge admin-badge--muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link
                        to={`/admin/productos/${p.id}`}
                        className="admin-icon-btn"
                        aria-label={`Editar ${p.name}`}
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        aria-label={`Eliminar ${p.name}`}
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

export default Products;