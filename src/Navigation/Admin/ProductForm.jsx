import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useToast } from '../../context/ToastContext';

const EMPTY = {
  name: '', description: '', category: '', price: '', oldPrice: '',
  image: '', alt: '', badge: '', stock: '', rating: '', reviews: '',
  features: '', customizable: false, customizationLabel: '',
  customizationPlaceholder: '', customizationMax: 20,
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, createProduct, updateProduct } = useProducts();
  const { toast } = useToast();

  const editing = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const isEdit = Boolean(editing);

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    setForm({
      ...EMPTY,
      ...editing,
      price: String(editing.price ?? ''),
      oldPrice: editing.oldPrice ? String(editing.oldPrice) : '',
      stock: editing.stock ? String(editing.stock) : '',
      rating: editing.rating ? String(editing.rating) : '',
      reviews: editing.reviews ? String(editing.reviews) : '',
      features: (editing.features || []).join('\n'),
    });
  }, [editing]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('El nombre es obligatorio.');
    if (!form.price || Number(form.price) <= 0) return setError('El precio debe ser mayor a 0.');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      image: form.image.trim(),
      alt: form.alt.trim() || form.name.trim(),
      badge: form.badge || undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
      reviews: form.reviews ? Number(form.reviews) : undefined,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      customizable: form.customizable,
      customizationLabel: form.customizable ? form.customizationLabel : undefined,
      customizationPlaceholder: form.customizable ? form.customizationPlaceholder : undefined,
      customizationMax: form.customizable ? Number(form.customizationMax) || 20 : undefined,
    };

    try {
      if (isEdit) {
        updateProduct(id, payload);
        toast('Producto actualizado', { type: 'success' });
      } else {
        createProduct(payload);
        toast('Producto creado', { type: 'success' });
      }
      navigate('/admin/productos');
    } catch (err) {
      setError(err.message || 'Error guardando');
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>
          <p>{isEdit ? `#${id}` : 'Completá los datos para agregarlo al catálogo.'}</p>
        </div>
        <div className="admin-page-header__actions">
          <Link to="/admin/productos" className="btn btn--secondary">
            <ArrowLeft size={16} /> Volver
          </Link>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <section className="admin-card">
          <div className="admin-card__header"><h2>Información básica</h2></div>
          <div className="admin-card__body">
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="name">Nombre *</label>
                <input id="name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="admin-field">
                <label htmlFor="category">Categoría</label>
                <input id="category" value={form.category} onChange={set('category')} placeholder="Aros, Pulseras…" />
              </div>
              <div className="admin-field admin-form__grid--full">
                <label htmlFor="description">Descripción</label>
                <textarea id="description" rows={3} value={form.description} onChange={set('description')} />
              </div>
              <div className="admin-field">
                <label htmlFor="image">URL de imagen</label>
                <input id="image" value={form.image} onChange={set('image')} placeholder="/Img/producto.jpg" />
              </div>
              <div className="admin-field">
                <label htmlFor="alt">Texto alternativo</label>
                <input id="alt" value={form.alt} onChange={set('alt')} />
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header"><h2>Precio y stock</h2></div>
          <div className="admin-card__body">
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="price">Precio *</label>
                <input id="price" type="number" min="0" step="1" value={form.price} onChange={set('price')} required />
              </div>
              <div className="admin-field">
                <label htmlFor="oldPrice">Precio anterior</label>
                <input id="oldPrice" type="number" min="0" step="1" value={form.oldPrice} onChange={set('oldPrice')} />
              </div>
              <div className="admin-field">
                <label htmlFor="stock">Stock</label>
                <input id="stock" type="number" min="0" step="1" value={form.stock} onChange={set('stock')} />
              </div>
              <div className="admin-field">
                <label htmlFor="badge">Estado</label>
                <select id="badge" value={form.badge} onChange={set('badge')}>
                  <option value="">Sin badge</option>
                  <option value="new">Nuevo</option>
                  <option value="sale">Oferta</option>
                  <option value="custom">Grabado</option>
                  <option value="soldout">Agotado</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="rating">Rating (0–5)</label>
                <input id="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
              </div>
              <div className="admin-field">
                <label htmlFor="reviews">Cantidad de reseñas</label>
                <input id="reviews" type="number" min="0" step="1" value={form.reviews} onChange={set('reviews')} />
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header"><h2>Características y personalización</h2></div>
          <div className="admin-card__body">
            <div className="admin-form__grid">
              <div className="admin-field admin-form__grid--full">
                <label htmlFor="features">Características (una por línea)</label>
                <textarea id="features" rows={4} value={form.features} onChange={set('features')} placeholder="Hecho a mano&#10;Envío a todo el país" />
              </div>

              <div className="admin-field admin-form__grid--full">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.customizable} onChange={set('customizable')} />
                  <Sparkles size={14} /> Permitir personalización
                </label>
              </div>

              {form.customizable && (
                <>
                  <div className="admin-field">
                    <label htmlFor="customizationLabel">Etiqueta del campo</label>
                    <input id="customizationLabel" value={form.customizationLabel} onChange={set('customizationLabel')} placeholder="Texto a grabar" />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="customizationMax">Máx. caracteres</label>
                    <input id="customizationMax" type="number" min="1" max="100" value={form.customizationMax} onChange={set('customizationMax')} />
                  </div>
                  <div className="admin-field admin-form__grid--full">
                    <label htmlFor="customizationPlaceholder">Placeholder</label>
                    <input id="customizationPlaceholder" value={form.customizationPlaceholder} onChange={set('customizationPlaceholder')} />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {error && <p className="admin-field__error" role="alert">{error}</p>}

        <div className="admin-form__actions">
          <Link to="/admin/productos" className="btn btn--secondary">Cancelar</Link>
          <button type="submit" className="btn btn--primary">
            <Save size={16} /> {isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;