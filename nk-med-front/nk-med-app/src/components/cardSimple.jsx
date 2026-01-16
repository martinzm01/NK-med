import { Link } from "react-router-dom";

// Agregamos 'genero' a las desestructuración de props
export default function TarjetaProducto({ id, nombre, precio, color, imagen, genero }) {
  return (
    <div className="group relative">
      {/* Contenedor de Imagen con position relative para ubicar la etiqueta */}
      <div className="relative overflow-hidden rounded-md bg-white">
        <img
          src={imagen}
          alt={nombre}
          className="lg:aspect-auto aspect-auto w-full object-cover group-hover:opacity-75 lg:h-80 transition-opacity duration-300"
        />
        
        {/* Etiqueta de Género - Posicionada exactamente como en el detalle */}
        <div className="absolute bottom-4 left-2 bg-white/90 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest text-teal-900 border border-teal-900/10 shadow-sm z-10">
          {genero || "Unisex"}
        </div>
      </div>
      
      {/* Contenedor de Información */}
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/producto/${id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {nombre}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{color}</p>
        </div>
        
        <p className="text-sm font-medium text-gray-900">${precio}</p>
      </div>
    </div>
  );
}