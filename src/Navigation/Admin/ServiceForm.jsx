import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useServices } from '../../context/ServicesContext';
import { useToast } from '../../context/ToastContext';

const EMPTY = {
  slug: '', category: '', title: '', description: '', detail: '',
  image: '', alt: '', pieces: '',
};

const ServiceForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { services, createService, updateService } = useServices();
  const { toast } = useToast();

  const editing = useMemo(() => services.find((s) => s.slug === slug), [services, slug]);
  const isEdit = Boolean(editing);

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    setForm({
      ...EMPTY,
      ...editing,
      pieces: (editing.pieces || []).join('\n'),
    });
  }, [editing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.slug.trim()) return setError('El slug es obligatorio.');
    if (!form.title.trim()) return setError('El título es obligatorio.');

    const payload = {
      slug: form.slug.trim(),
      category: form.category.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      detail: form.detail.trim(),
      image: form.image.trim(),
      alt: form.alt.trim() || form.title.trim(),
      pieces: form.pieces.split('\n').map((p) => p.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        updateService(slug, payload);
        toast('Servicio actualizado', { type: 'success' });
      } else {
        createService(payload);
        toast('Servicio creado', { type: 'success' });
      }
      navigate('/admin/servicios');
    } catch (err) {
      setError(err.message || 'Error guardando');
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>{isEdit ? 'Editar servicio' : 'Nuevo servicio'}</h1>
          <p>{isEdit ? form.slug : 'Completá los datos para agregarlo.'}</p>
        </div>
        <div className="admin-page-header__actions">
          <Link to="/admin/servicios" className="btn btn--secondary">
            <ArrowLeft size={16} /> Volver
          </Link>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <section className="admin-card">
          <div className="admin-card__header"><h2>Información</h2></div>
          <div className="admin-card__body">
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="slug">Slug *</label>
                <input id="slug" value={form.slug} onChange={set('slug')} disabled={isEdit} placeholder="nombres" />
                {isEdit && <span className="admin-field__hint">El slug no se puede editar.</span>}
              </div>
              <div className="admin-field">
                <label htmlFor="category">Categoría</label>
                <input id="category" value={form.category} onChange={set('category')} placeholder="Texto, Imagen…" />
              </div>
              <div className="admin-field admin-form__grid--full">
                <label htmlFor="title">Título *</label>
                <input id="title" value={form.title} onChange={set('title')} required />
              </div>
              <div className="admin-field admin-form__grid--full">
                <label htmlFor="description">Descripción corta</label>
                <textarea id="description" rows={2} value={form.description} onChange={set('description')} />
              </div>
              <div className="admin-field admin-form__grid--full">
                <label htmlFor="detail">Detalle</label>
                <textarea id="detail" rows={3} value={form.detail} onChange={set('detail')} />
              </div>
              <div className="admin-field">
                <label htmlFor="image">URL de imagen</label>
                <input id="image" value={form.image} onChange={set('image')} />
              </div>
              <div className="admin-field">
                <label htmlFor="alt">Texto alternativo</label>
                <input id="alt" value={form.alt} onChange={set('alt')} />
              </div>
              <div className="admin-field admin-form__grid--full">
                <label htmlFor="pieces">Piezas (una por línea)</label>
                <textarea id="pieces" rows={4} value={form.pieces} onChange={set('pieces')} placeholder="Pulsera&#10;Dije&#10;Anillo" />
              </div>
            </div>
          </div>
        </section>

        {error && <p className="admin-field__error" role="alert">{error}</p>}

        <div className="admin-form__actions">
          <Link to="/admin/servicios" className="btn btn--secondary">Cancelar</Link>
          <button type="submit" className="btn btn--primary">
            <Save size={16} /> {isEdit ? 'Guardar cambios' : 'Crear servicio'}
          </button>
        </div>
      </form>
    </>
  );
};

export default ServiceForm;