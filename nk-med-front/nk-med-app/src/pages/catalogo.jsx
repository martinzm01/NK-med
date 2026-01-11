import { useState } from "react";
import { Link } from "react-router-dom";
import TarjetaProducto from "../components/cardSimple";

const PRODUCTOS_MOCK = [
  { id: 1, nombre: "Ambo Classic", precio: "45.00", color: "Bordó", imagen: "assets/c6.jpg", categoria: "Ambos",genero:"Unisex" },
  { id: 2, nombre: "Chaqueta Scrub", precio: "35.00", color: "Azul Marino", imagen: "assets/c4.jpg", categoria: "Chaquetas",genero:"Unisex" },
  { id: 3, nombre: "Ambo Slim Fit", precio: "50.00", color: "Verde Cirujano", imagen: "assets/c7.jpg", categoria: "Ambos" ,genero:"Mujer"},
  { id: 4, nombre: "Cofia Premium", precio: "12.00", color: "Blanco Aspen", imagen: "assets/pv.jpg", categoria: "Accesorios",genero:"Mujer" },
  { id: 5, nombre: "Ambo Classic", precio: "45.00", color: "Bordó", imagen: "assets/c6.jpg", categoria: "Ambos",genero:"Unisex" },
  { id: 6, nombre: "Chaqueta Scrub", precio: "35.00", color: "Azul Marino", imagen: "assets/c4.jpg", categoria: "Chaquetas",genero:"Hombre" },
];

const CATEGORIAS = ["Todos", "Ambos", "Chaquetas", "Accesorios"];
const GENEROS = ["Hombre", "Mujer", "Unisex"];

export default function CustomersAlsoPurchased() {
  const [categoriaSel, setCategoriaSel] = useState("Todos");
  const [generoSel, setGeneroSel] = useState("Todos");
  const [mostrarFiltrosMovil, setMostrarFiltrosMovil] = useState(false);

const productosFiltrados = PRODUCTOS_MOCK.filter(p => {
  // 1. Filtrado por Categoría
  const cumpleCategoria = categoriaSel === "Todos" || p.categoria === categoriaSel;

  // 2. Filtrado por Género (Lógica inclusiva para Unisex)
  const cumpleGenero = 
    generoSel === "Todos" ||     // Si no hay filtro, mostrar todo
    p.genero === generoSel ||    // Si coincide exactamente (Mujer == Mujer)
    p.genero === "Unisex";       // SIEMPRE incluir los Unisex en cualquier filtro de género

  return cumpleCategoria && cumpleGenero;
});

const limpiarFiltros = () => {
  setCategoriaSel("Todos");
  setGeneroSel("Todos");
};
  return (
    <div className="min-h-screen relative bg-white w-full text-black flex flex-col items-center justify-start  py-5">

      {/* Contenedor principal con max-width para centrar el contenido general */}
      <div className="w-full max-w-[1400px] lg:px-4 lg:pb-4 sm:pb-1">
        
        {/* Título */}
        <div className="flex content-center text-center items-center justify-center lg:mt-24 lg:mb-12 sm:mb-2">
          <h2 className="text-2xl  font-sans font-semibold tracking-[0.2em] text-black uppercase lg:mt-8">
            C A T Á L O G O
          </h2>
        </div>

        {/* Layout Principal con GRID para control total de anchos */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
          
          {/* Sidebar Izquierda - Ancho fijo y separado */}
          <aside className="hidden lg:block w-[200px] shrink-0">
            {/* Sección Categorías */}
            <h3 className="text-xs font-bold text-black uppercase tracking-[0.2em] border-b border-gray-100 pb-2 mb-6">
              Categorías
            </h3>
            <ul className="space-y-5 mb-10">
              {CATEGORIAS.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategoriaSel(cat)}
                    className={`text-[11px] text-left w-full uppercase tracking-[0.2em] transition-all ${
                      categoriaSel === cat ? "text-black font-bold" : "text-gray-400 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            {/* Sección Género */}
            <h3 className="text-xs font-bold text-black uppercase tracking-[0.2em] border-b border-gray-100 pb-2 mb-6">
              Género
            </h3>
            <ul className="space-y-5">
              <li>
                <button
                  onClick={() => setGeneroSel("Todos")}
                  className={`text-[11px] text-left w-full uppercase tracking-[0.2em] transition-all ${
                    generoSel === "Todos" ? "text-black font-bold" : "text-gray-400 hover:text-black"
                  }`}
                >
                  Todos
                </button>
              </li>
              {GENEROS.map((gen) => (
                <li key={gen}>
                  <button
                    onClick={() => setGeneroSel(gen)}
                    className={`text-[11px] text-left w-full uppercase tracking-[0.2em] transition-all ${
                      generoSel === gen ? "text-black font-bold" : "text-gray-400 hover:text-black"
                    }`}
                  >
                    {gen}
                  </button>
                </li>
              ))}
            </ul>

            {/* Botón Limpiar */}
            {(categoriaSel !== "Todos" || generoSel !== "Todos") && (
              <button
                onClick={limpiarFiltros}
                className="mt-10 text-[10px] uppercase tracking-[0.1em] text-red-800 hover:underline transition-all"
              >
                ✕ Limpiar filtros
              </button>
            )}
          </aside>

          <div className="lg:hidden mb-6">
            <button 
              onClick={() => setMostrarFiltrosMovil(!mostrarFiltrosMovil)}
              className="w-full text-black border border-black py-2 text-xs font-sans tracking-widest uppercase flex justify-center items-center gap-2"
            >
              Filtros {mostrarFiltrosMovil ? '▲' : '▼'}
            </button>
            
            {mostrarFiltrosMovil && (
              <div className="mt-2 bg-gray-50 p-4 rounded-md space-y-6">
                {/* Categorías en móvil */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400">Categorías</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIAS.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoriaSel(cat)}
                        className={`text-[10px] uppercase tracking-widest py-2 border ${
                          categoriaSel === cat ? 'bg-black text-white border-black' : 'text-gray-500 bg-white border-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Género en móvil */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400">Género</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setGeneroSel("Todos")}
                      className={`text-[10px] uppercase tracking-widest   py-2 border ${
                        generoSel === "Todos" ? 'bg-black text-white border-black' : 'text-gray-500 cursor-pointer bg-white border-gray-200'
                      }`}
                    >
                      Todos
                    </button>
                    {GENEROS.map((gen) => (
                      <button
                        key={gen}
                        onClick={() => setGeneroSel(gen)}
                        className={`text-[10px] uppercase tracking-widest py-2 border ${
                          generoSel === gen ? 'bg-black text-white border-black' : 'text-gray-500 bg-white border-gray-200'
                        }`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botón Aplicar/Cerrar móvil */}
                <button 
                  onClick={() => setMostrarFiltrosMovil(false)}
                  className="w-full bg-[#2D3A30] text-white py-3 text-[10px] uppercase tracking-[0.2em]"
                >
                  Ver Resultados
                </button>
              </div>
            )}
          </div>

          {/* Grid de productos - Columnas simétricas */}
          <main>
            <div className="grid grid-cols-2 lg:gap-x-10  gap-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10 sm:px-10">
              {productosFiltrados.map((producto) => (
                <TarjetaProducto 
                  key={producto.id}
                  {...producto}
                />
              ))}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}