import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { Menu, X } from "lucide-react"; // Asegúrate de que coincida con tu importación original

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mantenemos tus clases de estilo originales
  const desktopLinkClasses = "font-sans text-sm font-light tracking-wide text-white transition-colors hover:text-white dark:hover:text-white";
  const mobileLinkClasses = "block py-3 font-sans text-base font-light text-white transition-colors hover:text-white dark:hover:text-white";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/inicio", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/contactos", label: "Contactános" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md shadow-sm py-1"
          : "bg-teal-950/97 dark:bg-black/90 lg:pt-4 lg:pb-2 py-2"
      }`}
    >
      {/* 1. Agregado px-4 para que el contenido no toque los bordes en el teléfono */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          
          {/* LOGO AREA: Ahora con ancho responsivo para que no sea gigante en móvil */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/iconologo.png" 
              alt="Logo" 
              className="h-auto w-24 lg:w-30 object-contain pt-4" 
            />
          </Link>

          {/* Navegación desktop (No cambia) */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={desktopLinkClasses}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botón menú móvil: Mantenemos tu color white */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white dark:text-white md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable: Mantenemos tu fondo original bg-teal-950/97 */}
      {isMenuOpen && (
        <div className="bg-teal-950/97 dark:bg-black/95 backdrop-blur-md md:hidden border-t border-white/10">
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
          </div>
        </div>
      )}
    </nav>
  );
}
