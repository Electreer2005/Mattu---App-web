import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext'
import { FavoritesProvider } from '../context/FavoritesContext';

import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Loader from '../components/Loader/Loader';
import BottomNav from '../components/BottomNav/BottomNav';

import Home from './Main/Home';
import Services from './Main/Services';
import Products from './Main/Products'
import ServiceDetail from './Main/ServiceDetail';
import ProductDetail from './Main/ProductDetail';
import Cart from './Main/Cart';
import Profile from './Main/Profile';
import EditProfile from './Main/EditProfile';
import Settings from './Main/Settings';
import Favorites from './Main/Favorites';

import './Main/Main.css';

const MainNavigator = () => {
  const { isLoading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  if (isLoading) {
    return (
      <>
        <Loader message="Cargando Mattu" />
      </>
    )
  }

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="app-shell">
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            isMenuOpen={isSidebarOpen}
          />

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <BottomNav />

          <main className="container section">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/servicios/:slug" element={<ServiceDetail />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/productos/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/editar-perfil" element={<EditProfile />} />
              <Route path="/configuracion" element={<Settings />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="*" element={<div>
                <h1>Página no encontrada</h1>
                <p>La página que estás buscando no existe.</p>
              </div>} />
            </Routes>
          </main>
        </div>
      </FavoritesProvider>

    </CartProvider>

  );
};

export default MainNavigator;