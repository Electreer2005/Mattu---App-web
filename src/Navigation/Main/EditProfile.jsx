import { useState, useRef } from 'react';
import {
  Camera, User, Mail, Phone, MapPin, FileText, Save, X, Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const EditProfile = () => {
  const {
    user, updateProfile, updateAvatar, removeAvatar, isLoading,
  } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });
  const [errors, setErrors] = useState({});

  const initials = (form.name || '')
    .split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (form.phone && !/^[\d\s+()-]{6,}$/.test(form.phone))
      e.phone = 'Teléfono inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAvatar = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    try {
      await updateAvatar(file);
      toast('Foto actualizada', { type: 'success' });
    } catch (err) {
      toast(err.message, { type: 'error' });
    } finally {
      ev.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
      toast('Foto eliminada', { type: 'info' });
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await updateProfile(form);
      toast('Perfil actualizado', { type: 'success' });
      navigate('/perfil');
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  };

  return (
    <div className="EditProfile-page">
      <header className="EditProfile-header">
        <h1>Editar perfil</h1>
        <p>Actualizá tu información personal y tu foto.</p>
      </header>

      <form className="EditProfile-form" onSubmit={handleSubmit} noValidate>
        <section className="EditProfile-section">
          <div className="EditProfile-avatar">
            <div className="EditProfile-avatar-circle">
              {user?.avatar ? (
                <img src={user.avatar} alt={form.name || 'Avatar'} />
              ) : (
                <span>{initials || <User size={32} />}</span>
              )}
            </div>

            <div className="EditProfile-avatar-actions">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Camera size={14} /> {user?.avatar ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {user?.avatar && (
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  onClick={handleRemoveAvatar}
                  disabled={isLoading}
                >
                  <Trash2 size={14} /> Quitar
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                hidden
              />
            </div>
          </div>
        </section>

        <section className="EditProfile-section">
          <h2 className="EditProfile-section-title">Datos personales</h2>

          <div className="EditProfile-grid">
            <div className={`form-field ${errors.name ? 'form-field--error' : ''}`}>
              <label htmlFor="name"><User size={14} /> Nombre completo</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="form-field__error">{errors.name}</span>}
            </div>

            <div className={`form-field ${errors.email ? 'form-field--error' : ''}`}>
              <label htmlFor="email"><Mail size={14} /> Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                readOnly
                aria-describedby="email-immutable-note"
                autoComplete="email"
              />
              <span id="email-immutable-note" className="form-field__hint">El correo de acceso no se modifica desde el perfil.</span>
            </div>

            <div className={`form-field ${errors.phone ? 'form-field--error' : ''}`}>
              <label htmlFor="phone"><Phone size={14} /> Teléfono</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="+54 11 ..."
              />
              {errors.phone && <span className="form-field__error">{errors.phone}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="address"><MapPin size={14} /> Dirección</label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                placeholder="Calle, número, ciudad"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="bio"><FileText size={14} /> Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="Contanos algo sobre vos (opcional)"
            />
          </div>
        </section>

        <div className="EditProfile-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate('/perfil')}
            disabled={isLoading}
          >
            <X size={16} /> Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={isLoading}>
            <Save size={16} /> Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;