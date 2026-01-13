import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ChevronRight, ChevronLeft, Loader2, X } from 'lucide-react';
import { supabase } from "../../lib/supabase"; 

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProductoDetalle() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("productos").select("*").eq("id", id).single();
        if (error) throw error;
        setProducto(data);
      } catch (error) {
        console.error("Error cargando el producto:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProductoDetalle();
  }, [id]);

  const listaImagenes = producto?.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes 
    : ["/assets/placeholder.jpg"];

  const nextImage = () => setImagenActiva((prev) => (prev + 1) % listaImagenes.length);
  const prevImage = () => setImagenActiva((prev) => (prev - 1 + listaImagenes.length) % listaImagenes.length);

  const renderCaracteristicas = () => {
    if (!Array.isArray(producto?.caracteristicas)) return null;
    return producto.caracteristicas.map((char, index) => (
      <li key={index} className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/> 
        <span className="leading-tight">{char}</span>
      </li>
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Cargando detalles...</p>
    </div>
  );

  if (!producto) return <div className="p-20 text-center">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-white">
      
      {/* MODAL DE IMAGEN COMPLETA */}
      {modalAbierto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setModalAbierto(false)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setModalAbierto(false)}>
            <X className="w-8 h-8" />
          </button>
          <img src={listaImagenes[imagenActiva]} alt="" className="max-w-full max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <nav className="hidden md:flex max-w-7xl mx-auto px-6 pt-20 lg:pt-28 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
        <Link to="/catalogo" className="hover:text-black">Catálogo</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-teal-700 font-bold">{producto.categoria}</span>
      </nav>

      <div className="md:hidden pt-24 px-4 mb-4">
        <Link to="/catalogo" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
      </div>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 mt-3 gap-4 lg:gap-10 pb-12">
        
        {/* SECCIÓN IMAGEN + MINIATURAS */}
        <section className="px-4 md:px-8 flex flex-col-reverse md:flex-row mt-5 gap-4 md:gap-6 items-center">
          
          {/* Columna de Miniaturas */}
          {listaImagenes.length > 1 && (
            <div className="flex md:flex-col gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar md:max-h-[500px]">
              {listaImagenes.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImagenActiva(index)}
                  className={`relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-sm overflow-hidden border transition-all duration-300 ${
                    imagenActiva === index ? 'border-teal-600 opacity-100' : 'border-slate-100 opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Contenedor del Visor - MANEJO DE TAMAÑO FIJO Y BOTONES */}
          <div className="flex-1 w-full flex items-center justify-center">
            <div 
              onClick={() => setModalAbierto(true)}
              className="relative bg-slate-50 border border-slate-100/70 rounded-md overflow-hidden shadow-sm group 
                         w-full max-w-[400px] aspect-square md:aspect-[4/5] transition-all duration-500 cursor-zoom-in flex items-center justify-center"
            >
              {/* La imagen usa object-contain para no deformarse dentro del cuadro fijo */}
              <img 
                src={listaImagenes[imagenActiva]} 
                alt={producto.nombre} 
                className="w-full h-full object-contain block transition-opacity duration-300" 
              />

              {/* Botones de Navegación - Posicionados absolutamente respecto al contenedor fijo */}
              {listaImagenes.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-20"
                  >
                    <ChevronLeft className="w-5 h-5 text-teal-900" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-20"
                  >
                    <ChevronRight className="w-5 h-5 text-teal-900" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-10 left-4 bg-white/90 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest text-teal-900 border border-teal-900/10 shadow-sm z-10">
                {producto.genero || "Unisex"}
              </div>
            </div>
          </div>
        </section>

        {/* INFO DEL PRODUCTO (Sin cambios estéticos) */}
        <section className="px-6 md:px-8 lg:px-12 flex flex-col justify-center mt-6 lg:mt-0">
          <div className="mb-6">
            <span className="text-teal-600 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-2 block">Especificaciones</span>
            <h1 className="text-2xl md:text-3xl lg:text-5xl text-teal-950 mb-2 uppercase tracking-tighter leading-tight font-serif">{producto.nombre}</h1>
            <p className="text-sm md:text-base text-black font-sans font-light italic">Color: {producto.color || "No especificado"}</p>
            <p className="text-xl md:text-2xl font-sans font-bold text-teal-950 mt-2">${producto.precio}</p>
          </div>
          <div className="bg-teal-50/30 p-4 rounded-sm border-l-4 border-teal-600 mb-6 font-light italic text-sm md:text-base text-slate-600">
            "{producto.descripcion || "Diseño ergonómico pensado para la máxima movilidad profesional."}"
          </div>
          <div className="mb-6">
             <h3 className="text-[10px] uppercase tracking-widest text-teal-900 font-bold mb-4">Especificaciones del artículo:</h3>
             <ul className="space-y-2 mt-1 text-[11px] text-slate-500 uppercase tracking-widest font-sans">{renderCaracteristicas()}</ul>
          </div>
          <div className="flex flex-col gap-4">
            <a href={`https://wa.me/5493875875938?text=Me%20interesa%20el%20producto%20${producto.nombre}`} target="_blank" rel="noopener noreferrer" className="bg-[#5A848D] text-white py-4 md:py-5 px-8 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-[#3F5F64]/90 transition-all shadow-lg text-center">
              Consultar disponibilidad
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetalleProducto;