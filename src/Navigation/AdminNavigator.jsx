import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/Dashboard';
import AdminProducts from './Admin/Products';
import AdminProductForm from './Admin/ProductForm';
import AdminServices from './Admin/Services';
import AdminServiceForm from './Admin/ServiceForm';
import AdminOrders from './Admin/Orders';
import AdminUsers from './Admin/Users';
import AdminSettings from './Admin/Settings';
import './Admin/Admin.css';

const AdminNavigator = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<AdminProducts />} />
        <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
        <Route path="/admin/productos/:id" element={<AdminProductForm />} />
        <Route path="/admin/servicios" element={<AdminServices />} />
        <Route path="/admin/servicios/nuevo" element={<AdminServiceForm />} />
        <Route path="/admin/servicios/:slug" element={<AdminServiceForm />} />
        <Route path="/admin/pedidos" element={<AdminOrders />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/configuracion" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminNavigator;