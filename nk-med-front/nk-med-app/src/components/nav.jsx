import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Menu, X, LogOut, User, LogIn } from "lucide-react"; 
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // --- NUEVOS ESTADOS PARA EL SMART NAV ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const desktopLinkClasses = "font-sans text-md  font-normal tracking-wide text-black transition-colors hover:text-black";
  const mobileLinkClasses = "block py-3 font-sans text-base font-light text-white transition-colors hover:text-gray-300";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Lógica de transparencia (tu código original)
      setIsScrolled(currentScrollY > 20);

      // 2. Lógica de ocultamiento (Smart Nav)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll hacia abajo: ocultar
        setIsVisible(false);
        setIsMenuOpen(false); // Cerramos el menú móvil si estaba abierto
      } else {
        // Scroll hacia arriba: mostrar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]); // Dependencia del último scroll

  const navLinks = [
    { href: "/inicio", label: "Inicio |" },
    { href: "/catalogo", label: "Catálogo |" },
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
        // Lógica de movimiento arriba/abajo
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        // Lógica de color y sombra (isScrolled)
        isScrolled
          ? "bg-white backdrop-blur-md shadow-md py-1"
          : "bg-white lg:py-3 py-2"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/logo1blanco.png" 
              alt="Logo" 
              className={"h-auto w-25 lg:w-30 pt-2 object-contain" 
              
              }
                />
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden items-center text-black gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={desktopLinkClasses}>
                {link.label}
              </Link>
            ))}

            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-light text-black cursor-pointer border border-gray-100 rounded-lg hover:bg-black hover:text-white transition-all"
              >
                <LogOut size={16} /> Salir
              </button>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm gap-2 font-light flex text-black bg-black rounded-lg hover:bg-gray-100 hover:text-white transition-all"
              >
                <LogIn size={16} />Ingresar
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="bg-black/95 backdrop-blur-xl md:hidden border-t border-white/10 animate-in fade-in slide-in-from-top-2">
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
                  className="block py-3 font-sans text-base font-medium text-white/80"
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