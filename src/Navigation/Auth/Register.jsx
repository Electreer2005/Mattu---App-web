import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { register, isLoading } = useAuth();
    const { toast } = useToast();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            await register({ name, email, password });
            toast(`¡Bienvenido, ${name}!`, { type: 'success' });
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
            setPassword('');
        }
    };

    return (
        <div className='Auth-container'>
            <div className="form-container">
                <h2 className="form-title">Registro</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className='form-label'>Nombre</label>
                        <div className="input-box">
                            <User className="icon" />
                            <input
                                type="text"
                                id="name"
                                className='form-input'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ingrese tu nombre"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
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
                    <button type="submit" className="btn btn--secondary btn--block" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="spinner" size={20} /> Cargando...</>
                        ) : (
                            <>Regístrate <LogIn /></>
                        )}
                    </button>
                    <div className="AuthPage">
                        <p className="AuthText">
                            ¿Tienes cuenta? <Link to="/">Accede aquí</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}