import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Menu, X, LogOut, User,LogIn } from "lucide-react"; 
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto

export default function Navbar() {
  const { user, role, logout} = useAuth(); // Obtenemos el usuario y su rol
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const desktopLinkClasses = "font-sans text-sm font-light tracking-wide text-white transition-colors hover:text-gray-300";
  const mobileLinkClasses = "block py-3 font-sans text-base font-light text-white transition-colors hover:text-gray-300";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Links básicos
  const navLinks = [
    { href: "/inicio", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
  ];

  // Agregamos el link de Panel Operador SOLO si es admin
  if (role === 'admin') {
    navLinks.push({ href: "/panelOperador", label: "Panel Admin" });
  }


const handleLogout = async () => {
  await logout();
  navigate('/login');
};


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md shadow-sm py-1"
          : "bg-teal-950/97 dark:bg-black/90 lg:pt-4 lg:pb-2 py-2"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/iconologo.png" 
              alt="Logo" 
              className="h-auto w-24 lg:w-30 object-contain" 
            />
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={desktopLinkClasses}>
                {link.label}
              </Link>
            ))}

            {/* Botón condicional Desktop */}
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-light text-white cursor-pointer border  border-white/20 rounded-lg hover:bg-white/20 transition-all"
              >
                <LogOut size={16} /> Salir
              </button>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm gap-2 font-light flex text-white bg-black rounded-lg hover:bg-gray-100 hover:text-black transition-all"
              >
                <LogIn size={16} />Ingresar
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="bg-teal-950/97 backdrop-blur-md md:hidden border-t border-white/10">
          <div className="space-y-1 px-6 pb-6 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={mobileLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 font-sans text-base font-medium text-red-400 flex items-center gap-2"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block py-3 font-sans text-base font-medium text-indigo-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}