import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import TarjetaProducto from "../components/cardSimple";
import Footer from "../components/footer";
import { Filter, X } from "lucide-react"; 

const CATEGORIAS = ["Ambos", "Chaquetas", "Pantalones"];
const GENEROS = ["Hombre", "Mujer"];

export default function CatalogoProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSel, setCategoriaSel] = useState("Todos");
  const [generoSel, setGeneroSel] = useState("Todos");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProductos() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const productosAdaptados = data.map((p) => ({
          ...p,
          imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : "assets/placeholder.jpg",
        }));

        setProductos(productosAdaptados);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const cumpleCategoria = categoriaSel === "Todos" || p.categoria === categoriaSel;
    const cumpleGenero =
      generoSel === "Todos" ||
      p.genero === generoSel ||
      p.genero === "Unisex";

    return cumpleCategoria && cumpleGenero;
  });

  // BLOQUE DE FILTROS (MANTENIENDO TUS ESTILOS ORIGINALES)
  const FiltrosUX = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? "flex-col gap-10" : "flex-col md:flex-row gap-6"}`}>
      {/* Filtro por Categoría */}
      <div className="flex flex-wrap gap-3 items-center md:pr-10">
        <span className="text-xs uppercase tracking-[0.2em] text-gray-700 w-full md:w-24 font-bold">Categoría:</span>
        <div className="flex flex-wrap gap-2">
          {["Todos", ...CATEGORIAS].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoriaSel(cat);
                if(isMobile) setIsMobileMenuOpen(false);
              }}
              className={`text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 transition-all border ${
                categoriaSel === cat 
                ? "bg-black text-white border-black font-bold shadow-sm" 
                : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro por Género */}
      <div className="flex flex-wrap gap-3 items-center md:pl-10">
        <span className="text-xs uppercase tracking-[0.2em] text-gray-700 w-full md:w-24 font-bold md:pl-5">Género:</span>
        <div className="flex flex-wrap gap-2">
          {["Todos", ...GENEROS].map((gen) => (
            <button
              key={gen}
              onClick={() => {
                setGeneroSel(gen);
                if(isMobile) setIsMobileMenuOpen(false);
              }}
              className={`text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 transition-all border ${
                generoSel === gen 
                ? "bg-teal-700 text-white border-teal-700 font-bold shadow-sm" 
                : "bg-white text-gray-400 border-gray-100 hover:border-teal-700 hover:text-teal-700"
              }`}
            >
              {gen}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm uppercase tracking-[0.3em] animate-pulse text-gray-500">Cargando Colección...</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      
{/* MODAL DE FILTROS PARA TELÉFONOS - DISEÑO VERTICAL */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* Cabecera del Menú Móvil */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-black">Filtrar Colección</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {/* Sección Categorías en Móvil */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-6">Seleccionar<span className="text-black ml-3">Categoría</span></span>
                <div className="flex flex-col gap-3">
                  {["Todos", ...CATEGORIAS].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaSel(cat)}
                      className={`flex justify-between items-center w-full px-6 py-4 text-[11px] uppercase tracking-[0.2em] transition-all border ${
                        categoriaSel === cat 
                        ? "bg-black text-white border-black font-bold" 
                        : "bg-white text-gray-500 border-gray-100"
                      }`}
                    >
                      {cat}
                      {categoriaSel === cat && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección Género en Móvil */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-6">Seleccionar <span className="text-black ml-3">Género</span></span>
                <div className="flex flex-col gap-3">
                  {["Todos", ...GENEROS].map((gen) => (
                    <button
                      key={gen}
                      onClick={() => setGeneroSel(gen)}
                      className={`flex justify-between items-center w-full px-6 py-4 text-[11px] uppercase tracking-[0.2em] transition-all border ${
                        generoSel === gen 
                        ? "bg-black text-white border-black font-bold" 
                        : "bg-white text-gray-500 border-gray-100"
                      }`}
                    >
                      {gen}
                      {generoSel === gen && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón de Aplicar */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#5A848D] text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold shadow-xl"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white w-full text-black flex flex-col items-center py-5 mt-5 mb-5">
        <div className="w-full max-w-[1400px] px-10 md:px-20">
          
          {/* FILTROS PC: TAL CUAL ESTABAN */}
          <div className="hidden md:block border-b border-gray-100 mt-12 md:mt-23 pb-6 md:pb-6">
             <FiltrosUX />
          </div>

          {/* FILTROS TELÉFONO: BOTÓN DE ACCESO */}
          <div className="flex md:hidden items-center justify-between mt-12 border-b border-gray-100 pb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Colección</span>
              <span className="text-[10px] uppercase tracking-widest text-black font-bold">{categoriaSel} / {generoSel}</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 border border-black px-5 py-2 hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <Filter size={14} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Filtrar</span>
            </button>
          </div>

          {/* Título */}
          <div className="flex flex-col items-center justify-center lg:mt-5 mt-10 mb-10 md:mb-16">
            <h2 className="text-xl md:text-2xl font-sans font-semibold tracking-[0.2em] border-b pb-2 px-2 text-black uppercase">
              C A T Á L O G O
            </h2>
          </div>

          {/* Grid de productos */}
          <main>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 lg:grid-cols-4">
              {productosFiltrados.map((producto) => (
                <TarjetaProducto key={producto.id} {...producto} />
              ))}
            </div>

            {productosFiltrados.length === 0 && (
              <div className="text-center py-24">
                <p className="text-gray-400 uppercase tracking-widest text-[10px]">No se encontraron productos en esta selección</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer/>
    </div>
  );
}