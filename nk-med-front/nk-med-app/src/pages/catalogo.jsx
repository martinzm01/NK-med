import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import TarjetaProducto from "../components/cardSimple";

const CATEGORIAS = ["Ambos", "Chaquetas", "Pantalones"];
const GENEROS = ["Hombre", "Mujer",];

export default function CatalogoProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSel, setCategoriaSel] = useState("Todos");
  const [generoSel, setGeneroSel] = useState("Todos");

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm uppercase tracking-[0.3em] animate-pulse text-gray-500">Cargando Colección...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full text-black flex flex-col items-center py-5 mt-5">
      
      {/* 1. Ajuste de Padding: px-4 en móvil, px-20 en desktop */}
      <div className="w-full max-w-[1400px] px-10 md:px-20">
        
        {/* 2. Ajuste de Filtros: flex-col en móvil para que no se amontonen */}
        <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 mt-12 md:mt-23 pb-6 md:pb-0">
          
          {/* Filtro por Categoría */}
          <div className="flex flex-wrap gap-3 items-center md:pr-10">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-700 w-full md:w-24 font-bold">Categoría:</span>
            <div className="flex flex-wrap gap-2">
                {["Todos", ...CATEGORIAS].map((cat) => (
                <button
                    key={cat}
                    onClick={() => setCategoriaSel(cat)}
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
                    onClick={() => setGeneroSel(gen)}
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

        {/* Título */}
        <div className="flex flex-col items-center justify-center lg:mt-10 mt-1  mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-sans font-semibold tracking-[0.2em] border-b pb-2 px-2 text-black uppercase">
            C A T Á L O G O
          </h2>
        </div>

        {/* 3. Grid de productos: gap más pequeño en móvil para ganar espacio */}
        <main>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 lg:grid-cols-4">
            {productosFiltrados.map((producto) => (
              <TarjetaProducto 
                key={producto.id}
                {...producto}
              />
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
  );
}