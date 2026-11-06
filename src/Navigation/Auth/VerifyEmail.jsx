import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Estamos verificando tu correo...');

  useEffect(() => {
    let active = true;
    if (!token) {
      setStatus('error');
      setMessage('El enlace no contiene un token válido.');
      return () => { active = false; };
    }

    verifyEmail(token)
      .then((result) => {
        if (active) {
          setStatus('success');
          setMessage(result.message || 'Tu correo fue verificado. Ya podés iniciar sesión.');
        }
      })
      .catch((error) => {
        if (active) {
          setStatus('error');
          setMessage(error.message);
        }
      });

    return () => { active = false; };
  }, [token, verifyEmail]);

  return (
    <div className="Auth-container">
      <div className="form-container">
        {status === 'loading' && <Loader2 className="spinner" size={32} />}
        {status === 'success' && <CheckCircle size={34} />}
        {status === 'error' && <AlertCircle size={34} />}
        <h2 className="form-title">{status === 'success' ? 'Correo verificado' : status === 'error' ? 'No se pudo verificar' : 'Verificando correo'}</h2>
        <p>{message}</p>
        {status !== 'loading' && <Link to="/" className="btn btn--primary btn--block">Ir a iniciar sesión</Link>}
      </div>
    </div>
  );
}
