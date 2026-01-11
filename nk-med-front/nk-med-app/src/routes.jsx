import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PanelOperador from './pages/menu_operador'
import CustomersAlsoPurchased from './pages/catalogo'
import Inicio from "./pages/cliente/inicio"
import DetalleProducto from './pages/cliente/producto'
import Login from './pages/login'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/nav'
export default function AppRoutes() {  
  return (
    <AuthProvider> {/* Envolvemos todo para tener acceso al usuario y rol */}
      <BrowserRouter>
      <Navbar/>
        <Routes>
          {/* --- RUTAS PÚBLICAS (Cualquiera las ve) --- */}
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio/>} />
          <Route path="/catalogo" element={<CustomersAlsoPurchased/>} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/login" element={<Login />} />

          {/* --- RUTAS DE ADMINISTRADOR (Solo rol 'admin') --- */}
          <Route 
            path="/panelOperador" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PanelOperador />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por si entran a una ruta que no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}