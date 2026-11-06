import { useRef, useState } from 'react';
import { Camera, Trash2, User, Users, Heart, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Profile = () => {
    const { user, updateAvatar, removeAvatar, isLoading, logout } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef(null);
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLocalError('');

        try {
            await updateAvatar(file);
            toast('Foto actualizada', { type: 'success' });
        } catch (err) {
            setLocalError(err.message);
            toast(err.message, { type: 'error' });
        } finally {
            // Reset para permitir subir la misma imagen dos veces
            e.target.value = '';
        }
    };

    const handleRemove = async () => {
        try {
            await removeAvatar();
            toast('Foto eliminada', { type: 'info' });
        } catch (err) {
            toast(err.message, { type: 'error' });
        }
    };

    const initials = (user?.name || '')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleEditProfile = () => {
        navigate('/editar-perfil')
    }
    
    const handleSettings = () => {
        navigate('/configuracion')
    }

    const handleFavorites = () => {
        navigate('/favoritos')
    }

    const handleLogout = () => {
        logout();
        alert('Has cerrado sesión correctamente.');
        navigate('/')
    }
    return (
        <div className="Profile-page">
            <div className="Profile-user">
                <h1>Mi Perfil</h1>
                <div className="Profile-avatar-wrapper">
                    <div className="Profile-avatar">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={`Foto de ${user.name}`} />
                        ) : (
                            <span className="Profile-avatar-initials">
                                {initials || <User size={32} />}
                            </span>
                        )}
                    </div>

                    <div className="Profile-avatar-actions">
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
                                onClick={handleRemove}
                                disabled={isLoading}
                            >
                                <Trash2 size={14} /> Quitar
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden
                        />
                    </div>

                    {localError && <p className="form-error">{localError}</p>}
                </div>
                <div className="Profile-info">
                    {user && (
                        <div>
                            <p><strong>Nombre:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    )}
                </div>

            </div>

            <div className="Profile-buttons">
                <h1>Explora</h1>
                <button className="btn btn--primary" onClick={handleEditProfile}>
                    <Users/> Editar perfil
                </button>
                <button className="btn btn--primary" onClick={handleSettings}>
                    <Settings /> Configuracion
                </button>
                <button className="btn btn--primary" onClick={handleFavorites}>
                    <Heart/> Favoritos
                </button>
                <button className="btn btn--danger" onClick={handleLogout}>
                    <LogOut /> Cerrar sesión
                </button>
            </div>
        </div>
    )
}

export default Profile