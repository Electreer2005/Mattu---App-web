import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password.length < 10) {
      setError('La contraseña debe tener al menos 10 caracteres.');
      return;
    }
    try {
      await register({ name, email, password });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (sent) {
    return (
      <div className="Auth-container">
        <div className="form-container">
          <Send size={34} />
          <h2 className="form-title">Revisá tu correo</h2>
          <p>Enviamos un enlace de verificación a <strong>{email}</strong>. Abrilo para activar tu cuenta y después iniciá sesión.</p>
          <p className="auth-hint">El enlace vence en 24 horas. Si no lo encontrás, revisá la carpeta de spam.</p>
          <Link to="/" className="btn btn--primary btn--block">Volver al inicio de sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="Auth-container">
      <div className="form-container">
        <h2 className="form-title">Crear cuenta</h2>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre</label>
            <div className="input-box"><User className="icon" />
              <input id="name" type="text" className="form-input" value={name}
                onChange={(event) => setName(event.target.value)} placeholder="Tu nombre"
                autoComplete="name" disabled={isLoading} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo</label>
            <div className="input-box"><Mail className="icon" />
              <input id="email" type="email" className="form-input" value={email}
                onChange={(event) => setEmail(event.target.value)} placeholder="Tu correo"
                autoComplete="email" disabled={isLoading} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-box"><Lock className="icon" />
              <input id="password" type={showPassword ? 'text' : 'password'} className="form-input"
                value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 10 caracteres" autoComplete="new-password"
                minLength={10} disabled={isLoading} required />
              <button type="button" onClick={() => setShowPassword((value) => !value)}
                className="password-toggle" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn--secondary btn--block" disabled={isLoading}>
            {isLoading ? <><Loader2 className="spinner" size={20} /> Enviando...</> : <>Crear cuenta <Send /></>}
          </button>
          <div className="AuthPage"><p className="AuthText">¿Ya tenés cuenta? <Link to="/">Iniciá sesión</Link></p></div>
        </form>
      </div>
    </div>
  );
}
