import { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { forgotPassword, isLoading } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            await forgotPassword(email);
            toast('Si el email existe, te enviamos las instrucciones.', { type: 'success' });
            // En prod: no navegarías acá, el user clickea el link del mail.
            // Para demo: pasamos el email al reset
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='Auth-container'>
            <div className="form-container">
                <h2 className="form-title">Recuperar contraseña</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className='form-label'>Correo</label>
                        <div className="input-box">
                            <Mail className="icon" />
                            <input
                                type="email"
                                id="email"
                                className='form-input'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingrese tu correo"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn--ghost btn--block" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="spinner" size={20} /> Cargando...</>
                        ) : (
                            <>Enviar correo <Mail /></>
                        )}
                    </button>
                    <div className="AuthPage">
                        <Link to="/">
                            <button type="button" className='btn btn-outline'>
                                <ArrowLeft /> Volver
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}