import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Cargando permisos...</div>; // O un spinner
  }

  // Si no está logueado, al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el rol no está permitido (ej: es 'client' y la ruta pide 'admin')
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};