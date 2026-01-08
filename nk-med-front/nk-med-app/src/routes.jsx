import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PanelOperador from './pages/menu_operador'
import CustomersAlsoPurchased from './pages/catalogo'
import Inicio from "./pages/cliente/inicio"
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio/>} />
        <Route path="/panelOperador" element={<PanelOperador />} />
        <Route path="/catalogo" element={<CustomersAlsoPurchased/>} />

      </Routes>
    </BrowserRouter>
  )
}
