import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <div className="auth-loading-screen"><div className="spinner-large" /><p>Cargando sesión…</p></div>;
  }

  if (!isAuthenticated) return <AuthNavigator />;

  // Una sola sesión: la tienda es la navegación principal y /admin es una sección protegida.
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminNavigator />} />
      <Route path="/*" element={<MainNavigator />} />
    </Routes>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader message="Cargando Mattu..." />;

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ProductsProvider>
              <ServicesProvider><NavigatorSwitch /></ServicesProvider>
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}