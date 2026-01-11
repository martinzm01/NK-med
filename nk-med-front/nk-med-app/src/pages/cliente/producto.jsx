import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ChevronRight, Share2 } from 'lucide-react';
import Navbar from '../../components/nav';

// Mismo mock que el catálogo
const PRODUCTOS_MOCK = [
  { id: 1, nombre: "Ambo Classic", precio: "45.00", color: "Bordó", imagen: "/assets/c6.jpg", categoria: "Ambos", genero:"Unisex", descripcion: "Tejido tecnológico de alta resistencia, diseñado para profesionales que buscan confort durante largas jornadas." },
  { id: 2, nombre: "Chaqueta Scrub", precio: "35.00", color: "Azul Marino", imagen: "/assets/c4.jpg", categoria: "Chaquetas",genero:"Unisex" },
  { id: 3, nombre: "Ambo Slim Fit", precio: "50.00", color: "Verde Cirujano", imagen: "/assets/c7.jpg", categoria: "Ambos" ,genero:"Mujer"},
  { id: 4, nombre: "Cofia Premium", precio: "12.00", color: "Blanco Aspen", imagen: "/assets/pv.jpg", categoria: "Accesorios",genero:"Mujer" },
  { id: 5, nombre: "Ambo Classic", precio: "45.00", color: "Bordó", imagen: "/assets/c6.jpg", categoria: "Ambos",genero:"Unisex" },
  { id: 6, nombre: "Chaqueta Scrub", precio: "35.00", color: "Azul Marino", imagen: "/assets/c4.jpg", categoria: "Chaquetas",genero:"Hombre" },

];

const DetalleProducto = () => {
  const { id } = useParams();
  const producto = PRODUCTOS_MOCK.find(p => p.id === parseInt(id));

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!producto) return <div className="p-20 text-center font-serif uppercase tracking-widest text-slate-400">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumbs - Ocultos en móviles muy pequeños para limpiar la vista */}
      <nav className="hidden sm:flex max-w-7xl mx-auto px-6 pt-24 lg:pt-32 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
        <Link to="/catalogo" className="hover:text-black">Catálogo</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-teal-600 font-bold">{producto.categoria}</span>
      </nav>

      {/* Botón Volver exclusivo para Móvil (flotante o discreto) */}
      <div className="sm:hidden pt-20 px-4">
        <Link to="/catalogo" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12 py-6 lg:py-12">
        
        {/* COLUMNA 1: IMAGEN (Prioridad en Móvil) */}
        <section className="px-0 sm:px-4 lg:px-8">
          <div className="bg-slate-50 relative aspect-[4/5] sm:rounded-md overflow-hidden shadow-sm">
             <img 
              src={producto.imagen} 
              alt={producto.nombre} 
              className="w-full h-full object-cover" 
            />
            {/* Badge flotante sutil */}
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full lg:hidden">
              <Share2 className="w-4 h-4 text-teal-900" />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest text-teal-900 border border-teal-900/10 shadow-sm">
              {producto.genero}
            </div>
          </div>
        </section>

        {/* COLUMNA 2: INFO (Ajuste de padding para lectura cómoda en móvil) */}
        <section className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center font-serif">
          <div className="mb-6">
            <span className="text-teal-600 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] font-bold mb-2 block">
              Detalles Técnicos
            </span>
            <h1 className="text-3xl lg:text-5xl text-teal-950 mb-2 uppercase tracking-tighter leading-tight">
              {producto.nombre}
            </h1>
            <div className="flex items-center justify-between">
                <p className="text-base lg:text-lg text-slate-400 font-sans font-light italic">
                    Color {producto.color}
                </p>
                <p className="text-xl lg:text-2xl font-sans font-bold text-teal-950 lg:hidden">
                    ${producto.precio}
                </p>
            </div>
          </div>
          
          {/* Precio destacado en Desktop solamente */}
          <p className="hidden lg:block text-3xl font-sans font-bold text-teal-950 mb-8">
            ${producto.precio}
          </p>

          <div className="bg-teal-50/30 p-5 rounded-sm border-l-4 border-teal-600 mb-8">
            <p className="text-slate-600 font-light leading-relaxed italic text-sm lg:text-base">
              "{producto.descripcion || "Diseño ergonómico pensado para la máxima movilidad profesional, manteniendo siempre la elegancia y pulcritud."}"
            </p>
          </div>

          {/* Lista de características optimizada para pulgares */}
          <ul className="space-y-4 mb-10 text-[10px] lg:text-[11px] text-slate-500 uppercase tracking-widest font-sans">
            <li className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/> Tela repelente a líquidos
            </li>
            <li className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/> Costuras reforzadas
            </li>
            <li className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/> Ajuste profesional
            </li>
          </ul>

          {/* Botón de acción - Grande y fácil de presionar en móviles */}
          <div className="flex flex-col gap-4">
            <button className="bg-[#2D3A30] text-white py-5 px-8 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-teal-900 transition-all shadow-lg active:scale-[0.98]">
              Consultar disponibilidad
            </button>
            
            <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest mt-2">
              Envío sin cargo en compras superiores a $100
            </p>
          </div>
        </section>
      </main>

      {/* Footer / Espaciador para móviles con barra de navegación inferior */}
      <div className="h-12 lg:h-24"></div>
    </div>
  );
};

export default DetalleProducto;