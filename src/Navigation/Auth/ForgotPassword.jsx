import { useState } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="Auth-container">
      <div className="form-container">
        <h2 className="form-title">Recuperar contraseña</h2>
        {sent ? (
          <div className="auth-success">
            <CheckCircle size={32} />
            <p>Si existe una cuenta verificada con ese correo, te enviamos un enlace para crear una contraseña nueva. Revisá también spam.</p>
          </div>
        ) : (
          <>
            <p>Ingresá el correo de tu cuenta y te enviaremos un enlace seguro.</p>
            {error && <div className="auth-error" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo</label>
                <div className="input-box"><Mail className="icon" />
                  <input id="email" type="email" className="form-input" value={email}
                    onChange={(event) => setEmail(event.target.value)} placeholder="Tu correo"
                    autoComplete="email" disabled={isLoading} required />
                </div>
              </div>
              <button type="submit" className="btn btn--ghost btn--block" disabled={isLoading}>
                {isLoading ? <><Loader2 className="spinner" size={20} /> Enviando...</> : <>Enviar enlace <Mail /></>}
              </button>
            </form>
          </>
        )}
        <div className="AuthPage"><Link to="/" className="btn btn-outline"><ArrowLeft /> Volver al inicio</Link></div>
      </div>
    </div>
  );
}
