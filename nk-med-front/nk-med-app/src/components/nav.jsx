import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importamos useLocation
import { Menu, X, LogOut, LogIn } from "lucide-react"; 
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para detectar la ruta
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- LÓGICA DINÁMICA ---
  // Se considera "Inicio" si la ruta es exactamente "/" o "/inicio"
  const isHomePage = location.pathname === "/" || location.pathname === "/inicio" || location.pathname === "/login";

  const desktopLinkClasses = "font-sans text-md font-normal tracking-wide text-white transition-colors hover:text-white";
  const mobileLinkClasses = "block py-3 font-sans text-base font-medium text-white transition-colors hover:text-white/80";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false); 
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "/inicio", label: "Inicio |" },
    { href: "/catalogo", label: "Catálogo |" },
    { href: "/contacto", label: "Contacto |" },
  ];

  if (role === 'admin') {
    navLinks.push({ href: "/panelCatalogo", label: "Admin |" });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-black/20 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        // Si es Home -> Negro. Si es otra página -> Blanco.
        isScrolled
          ? `${isHomePage ? "bg-black/95" : "bg-white/95"} backdrop-blur-md shadow-md py-1`
          : `${isHomePage ? "bg-black" : "bg-white"} lg:py-3 py-2`
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          
          {/* LOGO con filtro para que se vea negro en páginas blancas */}
          <Link to="/" className="flex items-center">
            <img 
              src={isHomePage ? "/assets/iconologo.png" : "/assets/logo1blanco.png"} 
              alt="Logo" 
              className={isHomePage ? `h-auto w-24 lg:w-30 mt-5 object-contain transition-all` : `h-auto w-24 lg:w-30 mt-2 object-contain transition-all`} 
            />
          </Link>

          {/* Navegación Desktop */}
          <div className={`hidden items-center gap-10 md:flex ${isHomePage ? "text-white" : "text-black"}`}>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className={`font-sans text-md font-normal tracking-wide transition-colors ${
                  isHomePage 
                    ? "text-white hover:text-gray-300" // Hover gris claro sobre fondo negro
                    : "text-black hover:text-gray-500" // Hover gris oscuro sobre fondo blanco
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button 
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-normal cursor-pointer border rounded-lg transition-all ${
                  isHomePage 
                  ? "text-white border-white/40 hover:bg-white hover:text-black" 
                  : "text-black border-black/15 hover:bg-black hover:text-white"
                }`}
              >
                <LogOut size={16} /> Salir
              </button>
            ) : (
              <Link 
                to="/login" 
                className={`px-4 py-2 text-sm gap-2 font-normal flex border rounded-lg transition-all ${
                  isHomePage 
                  ? "text-white border-white/40 hover:bg-white hover:text-black" 
                  : "text-black border-black/15 hover:bg-black hover:text-white"
                }`}
              >
                <LogIn size={16} />Ingresar
              </Link>
            )}
          </div>

          {/* Botón menú móvil adaptativo */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${isHomePage ? "text-white" : "text-black"} md:hidden p-2`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className={`${isHomePage ? "bg-black" : "bg-white"} backdrop-blur-xl md:hidden border-t border-white/10 animate-in fade-in slide-in-from-top-2`}>
          <div className="space-y-1 px-6 pb-6 pt-4">
            {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block py-3 font-sans text-base font-medium transition-colors ${
                isHomePage 
                  ? "text-white hover:text-white/70" 
                  : "text-black hover:text-black/60" // Gris en móvil sobre fondo blanco
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
            
            <div className={`pt-4 border-t ${isHomePage ? "border-white/10" : "border-black/10"}`}>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 font-sans text-base font-medium text-red-500 flex items-center gap-2"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`block py-3 font-sans text-base font-medium ${isHomePage ? "text-white" : "text-black"}`}
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