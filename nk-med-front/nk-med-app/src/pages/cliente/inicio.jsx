import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/nav";
import React from 'react';
import { ChevronLeft, ChevronRight, Plus, X, CheckCircle2 } from "lucide-react";
import Footer from "../components/footer";

// 1. DATOS DEL CARRUSEL SECCIÓN 3 (Incluye el diseño claro y oscuro)
const slidesS3 = [
  {
    titulo: "Estilo y",
    subtitulo: "Elegancia",
    frase: "Práctico, duradero y repelente a líquidos.",
    img1: "assets/c2.jpg",
    img2: "assets/c6.jpg",
    bgCol: "bg-sky-100", 
    tituloCol: "text-teal-900/60",
    textoCol: "text-black",
    btnCol: "border-black/40 text-black hover:bg-black hover:text-white",
    flechasCol: "text-black"
  },
  {
    titulo: "Corte y",
    subtitulo: "Confort",
    frase: "Diseños ergonómicos pensados para la movilidad total en entornos exigentes.",
    img1: "assets/c4.jpg",
    img2: "assets/pv.jpg",
    bgCol: "bg-teal-950",
    tituloCol: "text-white",
    textoCol: "text-white/80",
    btnCol: "border-white/40 text-white hover:bg-white hover:text-teal-950",
    flechasCol: "text-white/50 hover:text-white"
  }
];

// --- COMPONENTE MODAL ---
const ProductModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-teal-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl grid lg:grid-cols-2 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-teal-950 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="bg-slate-100 h-64 lg:h-auto">
          <img src={data.imagen} alt={data.titulo} className="w-full h-full object-cover" />
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center font-serif">
          <span className="text-teal-600 text-xs uppercase tracking-widest font-bold mb-2">Detalles Técnicos</span>
          <h2 className="text-3xl text-teal-950 mb-4 uppercase">{data.titulo}</h2>
          <p className="text-slate-600 font-light mb-6 leading-relaxed italic">{data.descripcion}</p>
          <ul className="space-y-3 mb-8 text-sm text-slate-500 uppercase tracking-tighter">
            {data.puntos.map((punto, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600"/> {punto}
              </li>
            ))}
          </ul>
          <Link to="/catalogo" onClick={onClose} className="bg-[#2D3A30] text-white text-center py-4 uppercase tracking-[0.2em] text-xs hover:bg-teal-900 transition-colors">
            Ir al catálogo completo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Inicio() {
  // ESTADOS
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [indiceS3, setIndiceS3] = useState(0);
  const [indice, setIndice] = useState(0);

  const imagenes = ["assets/fondoInicio.png", "assets/2.png", "assets/1.png"];

  const detallesSecciones = {
    seccion2: {
      titulo: "Indumentaria Ergonómica",
      imagen: "assets/c4.jpg",
      descripcion: "Nuestros cortes están diseñados para seguir el movimiento natural del cuerpo médico.",
      puntos: ["Corte Slim Fit Profesional", "Costuras reforzadas", "Bolsillos estratégicos"]
    },
    seccion3: {
      titulo: "Tecnología Antifluidos",
      imagen: "assets/c2.jpg",
      descripcion: "Tejido de alta densidad con escudo repelente que protege contra salpicaduras.",
      puntos: ["Escudo Antiviral", "Secado Ultra-Rápido", "No requiere planchado"]
    }
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  const openModal = (key) => {
    setModalData(detallesSecciones[key]);
    setModalOpen(true);
  };

  const proximoS3 = () => setIndiceS3((prev) => (prev === slidesS3.length - 1 ? 0 : prev + 1));
  const anteriorS3 = () => setIndiceS3((prev) => (prev === 0 ? slidesS3.length - 1 : prev - 1));

  return (
    <div className="bg-teal-950 lg:py-5 sm:py-1">
      <Navbar />

{/* --- SECCIÓN 1: DISEÑO ORIGINAL EN LAPTOP / CENTRADO EN MÓVIL --- */}
<div 
  className="lg:mt-25 py-10 min-h-screen relative bg-cover bg-center w-full transition-all duration-1000 ease-in-out flex items-center lg:items-start justify-center" 
  style={{ backgroundImage: `url('${imagenes[indice]}')` }}
>
  <div className="absolute inset-0 bg-black/20"></div>
  
  {/* 1. En móviles es 'relative' (para centrarse por el flex del padre).
      2. En laptops (lg:) vuelve a ser 'relative w-full' con el padding-top original.
  */}
  <div className="relative w-full text-center flex items-center justify-center px-6 lg:pt-5">
    
    {/* 1. En móviles quitamos 'sm:mt-10' y dejamos que el flex lo centre.
        2. En laptops 'lg:mt-30' recupera su posición original.
    */}
    <div className="w-md justify-center lg:mt-30 px-6 py-10 bg-white/40">
      <h1 className="font font-bold text-5xl lg:mb-3 text-white drop-shadow-lg">NK MED</h1>
      <h1 className="font-serif font-light text-5xl mb-8 text-white drop-shadow-lg">AMBOS CLÍNICOS</h1>
      <Link to="/catalogo" className="bg-[#2D3A30] font-serif hover:bg-[#1e2620] inline-block text-white px-10 py-3 font-light tracking-widest text-sm uppercase">
        Ver catálogo
      </Link>
    </div>
  </div>
</div>


      <main className="min-h-screen font-serif bg-white">
        
        {/* SECCIÓN 2 */}
        <section className="relative min-h-screen">
          <div className="grid lg:grid-cols-2 min-h-screen">
            <div className="relative bg-[#2D3A30] px-8 lg:px-24 py-16 lg:py-24 flex items-center justify-end text-white">
              <div className="max-w-xl w-full">
                <h2 className="text-5xl lg:text-7xl font-light mb-3 leading-tight uppercase tracking-tighter">Guía de <br /><span className="italic font-normal">estilo</span></h2>
                <h3 className="text-lg lg:text-xl font-light mb-8 opacity-90 uppercase tracking-widest">Tendencias en indumentaria médica</h3>
                <p className="text-sm lg:text-base leading-relaxed mb-8 font-light italic opacity-80">Funcionalidad y elegancia en tu entorno profesional.</p>
              </div>
            </div>
            <div className="relative grid grid-cols-2">
              <div className="relative min-h-[400px]"><img src="assets/c4.jpg" className="absolute inset-0 w-full h-full object-cover" /></div>
              <div className="relative min-h-[400px]"><img src="assets/pv.jpg" className="absolute inset-0 w-full h-full object-cover" /></div>
              <button onClick={() => openModal('seccion2')} className="absolute -left-6 top-1/2 -translate-y-1/2 bg-[#2D3A30] text-white w-12 h-12 flex items-center justify-center shadow-xl z-20 cursor-pointer hover:bg-teal-900 transition-all">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: CARRUSEL DINÁMICO (DISEÑO CLARO/OSCURO) */}
        <section className="relative min-h-screen flex items-center bg-white border-t border-slate-100">
          <div className="w-full grid lg:grid-cols-2 min-h-screen">
            <div className="relative grid grid-cols-2 bg-white order-2 lg:order-1">
              <div className="relative min-h-[400px]"><img src={slidesS3[indiceS3].img1} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" /></div>
              <div className="relative min-h-[400px]"><img src={slidesS3[indiceS3].img2} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" /></div>
              <button onClick={() => openModal('seccion3')} className="absolute -right-6 lg:left-auto lg:-right-6 top-1/2 -translate-y-1/2 bg-[#2D3A30] text-white w-12 h-12 flex items-center justify-center shadow-xl z-20 cursor-pointer hover:bg-teal-900 transition-all">
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <div className={`relative ${slidesS3[indiceS3].bgCol} flex items-center justify-center px-8 lg:px-20 py-20 lg:py-24 order-1 lg:order-2 transition-colors duration-700`}>
              <div className="max-w-lg text-center lg:text-left">
                <h2 className={`text-5xl lg:text-7xl font-light ${slidesS3[indiceS3].tituloCol} mb-8 leading-tight uppercase`}>
                  {slidesS3[indiceS3].titulo} <br /><span className="italic">{slidesS3[indiceS3].subtitulo}</span>
                </h2>
                <p className={`${slidesS3[indiceS3].textoCol} text-base lg:text-lg leading-relaxed mb-10 font-light italic`}>
                  {slidesS3[indiceS3].frase}
                </p>
                <Link to="/catalogo" className={`border ${slidesS3[indiceS3].btnCol} px-10 py-4 transition-all duration-300 text-sm uppercase tracking-widest font-light`}>
                  Ver más
                </Link>
              </div>
            </div>
          </div>
          
          <button onClick={anteriorS3} className={`absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 ${slidesS3[indiceS3].flechasCol} transition-all z-20 cursor-pointer`}>
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button onClick={proximoS3} className={`absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 ${slidesS3[indiceS3].flechasCol} transition-all z-20 cursor-pointer`}>
            <ChevronRight className="w-10 h-10" />
          </button>
        </section>
        <Footer/>
      </main>

      <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={modalData} />
    </div>
  );
}
