import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, LogIn, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { resetPassword, isLoading } = useAuth();
    const { toast } = useToast();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (!email) {
            setError('Falta el email. Volvé a solicitar el reset.');
            return;
        }

        try {
            await resetPassword({ email, password });
            toast('¡Contraseña actualizada! Iniciá sesión.', { type: 'success' });
            navigate('/login', { replace: true });
        } catch (err) {
            setError(err.message);
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className='Auth-container'>
            <div className="form-container">
                <h2 className="form-title">Resetear contraseña</h2>
                {email && (
                    <p className="auth-hint">
                        Cuenta: <strong>{email}</strong>
                    </p>
                )}
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password" className='form-label'>Nueva contraseña</label>
                        <div className="input-box">
                            <Lock className="icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className='form-input'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Mínimo 6 caracteres'
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                            <button
                                type='button'
                                onClick={togglePasswordVisibility}
                                className="password-toggle"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className='form-label'>Confirmar contraseña</label>
                        <div className="input-box">
                            <Lock className="icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                className='form-input'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Repetí la contraseña'
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn--dark btn--block" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="spinner" size={20} /> Cargando...</>
                        ) : (
                            <>Resetear contraseña <LogIn /></>
                        )}
                    </button>
                    <div className="AuthPage">
                        <Link to="/">
                            <button type="button" className='btn btn-outline'>
                                <ArrowLeft /> Volver al login
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}