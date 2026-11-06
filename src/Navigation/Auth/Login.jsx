import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react';
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
    const { login, isLoading, isAuthenticated, user } = useAuth();
    const { toast } = useToast();

    // Si ya está logueado, redirigir según rol
    useEffect(() => {
        if (!isAuthenticated) return;
        navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
    }, [isAuthenticated, user, navigate]);

    const from = location.state?.from?.pathname || '/';

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const logged = await login({ email, password });
            toast('¡Bienvenido de vuelta!', { type: 'success' });
            navigate(logged?.role === 'admin' ? '/admin' : from, { replace: true });
        } catch (err) {
            setError(err.message);
            setPassword('');
        }
    };

    // Acceso rápido al panel (demo). Solo en desarrollo.
    const handleAdminDemo = async () => {
        setError('');
        try {
            const logged = await login({
                email: 'admin@mattu.com',
                password: 'admin123',
            });
            toast('Panel de administración', { type: 'success' });
            navigate(logged?.role === 'admin' ? '/admin' : '/', { replace: true });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='Auth-container'>
            <div className="form-container">
                <h2 className="form-title">Iniciar sesión</h2>
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
                    <div className="form-group">
                        <label htmlFor="password" className='form-label'>Contraseña</label>
                        <div className="input-box">
                            <Lock className="icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className='form-input'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Ingrese su contraseña'
                                disabled={isLoading}
                                required
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
                    <div className="forgot-password">
                        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                    </div>
                    <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="spinner" size={20} /> Cargando...</>
                        ) : (
                            <>Iniciar sesión <LogIn /></>
                        )}
                    </button>
                    <div className="AuthPage">
                        <p className="AuthText">
                            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                        </p>
                    </div>
                    <p className="auth-hint">
                        Demo cliente: <strong>demo@mattu.com</strong> / <strong>123456</strong>
                        <br />
                        Demo admin: <strong>admin@mattu.com</strong> / <strong>admin123</strong>
                    </p>

                    {import.meta.env?.DEV && (
                        <button
                            type="button"
                            className="btn btn--secondary btn--sm btn--block"
                            onClick={handleAdminDemo}
                            disabled={isLoading}
                        >
                            <ShieldCheck size={16} /> Entrar como admin (demo)
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}