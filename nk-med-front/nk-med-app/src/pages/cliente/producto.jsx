import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from "../../lib/supabase"; 

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchProductoDetalle() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("id", id)
          .single();

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Cargando detalles...</p>
      </div>
    );
  }

  if (!producto) return <div className="p-20 text-center">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav className="hidden md:flex max-w-7xl mx-auto px-6 pt-20 lg:pt-28 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
        <Link to="/catalogo" className="hover:text-black">Catálogo</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-teal-600 font-bold">{producto.categoria}</span>
      </nav>

      <div className="md:hidden pt-24 px-6">
        <Link to="/catalogo" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
      </div>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-10 ">
        
{/* SECCIÓN IMAGEN + MINIATURAS + BOTONES */}
<section className="px-4 md:px-8 flex flex-col-reverse md:flex-row gap-6 items-center  lg:min-h-[650px]">
  
  {/* Columna de Miniaturas */}
  {listaImagenes.length > 1 && (
    <div className="flex md:flex-col gap-3 w-full md:w-auto overflow-x-auto lg:mb-30  md:overflow-y-auto no-scrollbar md:max-h-[700px]">
      {listaImagenes.map((img, index) => (
        <button
          key={index}
          onClick={() => setImagenActiva(index)}
          className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-sm overflow-hidden border transition-all duration-300 ${
            imagenActiva === index ? 'border-teal-600 opacity-100' : 'border-slate-100 opacity-40 hover:opacity-70'
          }`}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  )}

  {/* Contenedor del Visor - ANCHO ESTÁTICO, ALTO ELÁSTICO CENTRADO */}
  <div className="flex-1 w-full flex items-center justify-center mb-20">
    <div 
      className="relative bg-slate-50 border border-slate-100/70 rounded-md overflow-hidden shadow-sm group 
                 w-full max-w-[400px] h-auto my-auto transition-all duration-500"
    >
      {/* - w-full max-w-[450px] mantiene el ancho estático.
          - h-auto permite que el div se encoja o crezca verticalmente.
          - flex + my-auto lo mantienen centrado respecto a la info de la derecha.
      */}
      <img 
        src={listaImagenes[imagenActiva]} 
        alt={producto.nombre} 
        className="w-full h-auto max-h-[65vh] object-contain block transition-opacity duration-500" 
      />

      {/* Botones de Navegación - Posición fija respecto al contenedor de 450px */}
      {listaImagenes.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-sm backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-teal-900" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-sm backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-10"
          >
            <ChevronRight className="w-5 h-5 text-teal-900" />
          </button>
        </>
      )}
      
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest text-teal-900 border border-teal-900/10 shadow-sm z-10">
        {producto.genero || "Unisex"}
      </div>
    </div>
  </div>
</section>
        {/* INFO DEL PRODUCTO */}
        <section className="p-4 md:p-8 lg:p-12 lg:py-1 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-teal-600 text-[10px] lg:text-md uppercase tracking-[0.3em] font-bold mb-2 block">
              Especificaciones
            </span>
            <h1 className="text-3xl lg:text-5xl text-teal-950 mb-2 uppercase tracking-tighter leading-tight font-serif">
              {producto.nombre}
            </h1>
            <p className="text-base lg:text-md text-black font-sans font-light italic">
              Color: {producto.color || "No especificado"}
            </p>
          </div>
          
          <p className="hidden lg:block text-2xl font-sans font-bold text-teal-950 mb-4">
            ${producto.precio}
          </p>

          <div className="bg-teal-50/30 p-4 rounded-sm border-l-4 border-teal-600 mb-5">
            <p className="text-slate-600 font-light leading-relaxed italic text-sm lg:text-base">
              "{producto.descripcion || "Diseño ergonómico pensado para la máxima movilidad profesional."}"
            </p>
          </div>

          <div className="mb-5">
             <h3 className="text-[10px] uppercase tracking-widest text-teal-900 font-bold mb-4">
               Especificaciones del artículo:
             </h3>
             <ul className="space-y-2 text-[10px] lg:text-[11px] text-slate-500 uppercase tracking-widest font-sans">
                {Array.isArray(producto.caracteristicas) && producto.caracteristicas.length > 0 ? (
                  renderCaracteristicas()
                ) : (
                  <li className="italic text-slate-400 normal-case tracking-normal">
                    No hay especificaciones adicionales para este producto.
                  </li>
                )}
             </ul>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href={`https://wa.me/5493875875938 Me interesa el producto ${producto.nombre}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5A848D] text-white py-5 px-8 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-[#3F5F64]/90 transition-all shadow-lg text-center"
            >
              Consultar disponibilidad
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetalleProducto;