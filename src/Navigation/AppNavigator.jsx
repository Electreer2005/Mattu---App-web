import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ProductsProvider } from '../context/ProductsContext';
import { ServicesProvider } from '../context/ServicesContext';
import Loader from '../components/Loader/Loader';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';

function NavigatorSwitch() {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner-large" />
        <p>Cargando sesión…</p>
      </div>
    );
  }

  if (!isAuthenticated) return <AuthNavigator />;
  if (user?.role === 'admin') return <AdminNavigator />;
  return <MainNavigator />;
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500); // 7s era demasiado
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader message="Cargando Mattu..." />;

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ProductsProvider>
              <ServicesProvider>
                <NavigatorSwitch />
              </ServicesProvider>
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}