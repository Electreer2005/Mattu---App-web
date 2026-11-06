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

  const updateAvatar = useCallback(async () => {
    throw new Error('La carga de fotos de perfil todavía no está conectada al almacenamiento seguro.');
  }, []);

  const removeAvatar = useCallback(async () => {
    throw new Error('La carga de fotos de perfil todavía no está conectada al almacenamiento seguro.');
  }, []);

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
