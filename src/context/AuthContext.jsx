import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { customerApi } from '../services/customerApi';

const AuthContext = createContext(null);

function resizeImage(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) return reject(new Error('El archivo debe ser una imagen.'));
    if (file.size > 5 * 1024 * 1024) return reject(new Error('La imagen no puede superar 5 MB.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('La imagen no es válida.'));
      image.onload = () => {
        const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let active = true;

    customerApi('session')
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser || null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsBootstrapping(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const run = useCallback(async (callback) => {
    setIsLoading(true);
    try {
      return await callback();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(({ email, password }) => run(async () => {
    const result = await customerApi('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(result.user);
    return result.user;
  }), [run]);

  const register = useCallback(({ name, email, password }) => run(() =>
    customerApi('auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  ), [run]);

  const verifyEmail = useCallback((token) => run(() =>
    customerApi('auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  ), [run]);

  const logout = useCallback(() => run(async () => {
    try {
      await customerApi('auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } finally {
      setUser(null);
    }
  }), [run]);

  const forgotPassword = useCallback((email) => run(() =>
    customerApi('auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  ), [run]);

  const resetPassword = useCallback(({ token, password }) => run(() =>
    customerApi('auth/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  ), [run]);

  const updateProfile = useCallback((profile) => run(async () => {
    const result = await customerApi('profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    setUser(result.user);
    return result.user;
  }), [run]);

  const updateAvatar = useCallback((file) => run(async () => {
    const avatar = await resizeImage(file);
    const result = await customerApi('profile/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar }),
    });
    setUser(result.user);
    return result.user;
  }), [run]);

  const removeAvatar = useCallback(() => run(async () => {
    const result = await customerApi('profile/avatar/remove', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    setUser(result.user);
    return result.user;
  }), [run]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    isBootstrapping,
    login,
    register,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    updateAvatar,
    removeAvatar,
  }), [
    user,
    isLoading,
    isBootstrapping,
    login,
    register,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    updateAvatar,
    removeAvatar,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
