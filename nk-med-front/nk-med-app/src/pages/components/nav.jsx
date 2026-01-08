import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Clases compartidas para mantener el diseño original
  const desktopLinkClasses = "font-sans text-sm font-light tracking-wide text-white transition-colors hover:text-white dark:hover:text-white";
  const mobileLinkClasses = "block py-3 font-sans text-base font-light text-white  transition-colors hover:text-white dark:hover:text-white";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 sm:py-2 lg:pt-4 lg:pb-2  ${
        isScrolled
          ? "bg-black/80   backdrop-blur-md shadow-sm"
          : "bg-teal-950/97 dark:bg-black/90"
      }`}
    >
      <div className="mx-auto max-w-7xl sm:py-2 lg-py-2">
        <div className="flex h-20 items-center justify-between">
          
          {/* LOGO AREA */}
          <Link to="/" className="flex items-center gap-3 ">
            <img 
              src="/assets/iconologo.png" 
              alt="Logo" 
              className="h-auto w-35 object-contain " 
            />

          </Link>

          {/* Navegación desktop */}
          <div className="hidden items-center gap-8 md:flex ">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={desktopLinkClasses}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white dark:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="border-t border-gray-300/50 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-md md:hidden">
          <div className="space-y-1 px-4 pb-6 pt-4">
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