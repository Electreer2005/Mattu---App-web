import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!token) return setError('El enlace no contiene un token válido. Solicitá otro correo.');
    if (password.length < 10) return setError('La contraseña debe tener al menos 10 caracteres.');
    if (password !== confirmPassword) return setError('Las contraseñas no coinciden.');
    try {
      await resetPassword({ token, password });
      setUpdated(true);
      setTimeout(() => navigate('/', { replace: true }), 1800);
    } catch (err) {
      setError(err.message);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="Auth-container">
      <div className="form-container">
        <h2 className="form-title">Crear nueva contraseña</h2>
        {updated ? (
          <div className="auth-success"><CheckCircle size={32} /><p>Tu contraseña fue actualizada. Ya podés iniciar sesión.</p><Link to="/">Ir a iniciar sesión</Link></div>
        ) : (
          <>
            {error && <div className="auth-error" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Nueva contraseña</label>
                <div className="input-box"><Lock className="icon" />
                  <input id="password" type={showPassword ? 'text' : 'password'} className="form-input"
                    value={password} onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 10 caracteres" autoComplete="new-password" minLength={10} required />
                  <button type="button" onClick={() => setShowPassword((value) => !value)}
                    className="password-toggle" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                <div className="input-box"><Lock className="icon" />
                  <input id="confirmPassword" type={showPassword ? 'text' : 'password'} className="form-input"
                    value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repetí la contraseña" autoComplete="new-password" required />
                </div>
              </div>
              <button type="submit" className="btn btn--dark btn--block" disabled={isLoading}>
                {isLoading ? <><Loader2 className="spinner" size={20} /> Guardando...</> : 'Actualizar contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
