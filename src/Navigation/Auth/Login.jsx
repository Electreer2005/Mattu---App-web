import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendVerification, isLoading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
  }, [isAuthenticated, user, navigate]);

  const handleResendVerification = async () => {
    try {
      await resendVerification(email);
      toast('Si la cuenta necesita verificación, te enviamos un nuevo enlace.', { type: 'success' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const logged = await login({ email, password });
      toast('¡Bienvenido de vuelta!', { type: 'success' });
      navigate(logged?.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.message);
      setPassword('');
    }
  };

  return (
    <div className="Auth-container">
      <div className="form-container">
        <h2 className="form-title">Iniciar sesión</h2>
        {error && <div className="auth-error" role="alert">{error}</div>}
        {error.toLowerCase().includes('verificá tu correo') && (
          <button type="button" className="btn btn--secondary btn--block" onClick={handleResendVerification} disabled={isLoading || !email.trim()}>
            Reenviar correo de verificación
          </button>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo</label>
            <div className="input-box">
              <Mail className="icon" />
              <input id="email" type="email" className="form-input" value={email}
                onChange={(event) => setEmail(event.target.value)} placeholder="Ingresá tu correo"
                autoComplete="email" disabled={isLoading} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-box">
              <Lock className="icon" />
              <input id="password" type={showPassword ? 'text' : 'password'} className="form-input"
                value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresá tu contraseña" autoComplete="current-password"
                disabled={isLoading} required />
              <button type="button" onClick={() => setShowPassword((value) => !value)}
                className="password-toggle" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className="forgot-password"><Link to="/forgot-password">¿Olvidaste tu contraseña?</Link></div>
          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isLoading}>
            {isLoading ? <><Loader2 className="spinner" size={20} /> Ingresando...</> : <>Iniciar sesión <LogIn /></>}
          </button>
          <div className="AuthPage">
            <p className="AuthText">¿No tenés cuenta? <Link to="/register">Registrate aquí</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
