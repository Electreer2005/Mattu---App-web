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

  // AppNavigator mounts this component at /admin/*, so child paths are relative.
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/nuevo" element={<AdminProductForm />} />
        <Route path="productos/:id" element={<AdminProductForm />} />
        <Route path="servicios" element={<AdminServices />} />
        <Route path="servicios/nuevo" element={<AdminServiceForm />} />
        <Route path="servicios/:slug" element={<AdminServiceForm />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="configuracion" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminNavigator;
