import { Link } from "react-router-dom";

export default function TarjetaProducto({ id, nombre, precio, imagen, genero }) {
  return (
    <div className="group relative lg:mx-2">
      {/* Contenedor de Imagen */}
      <div className="relative overflow-hidden rounded-md bg-white 
                      aspect-[3/4] lg:aspect-auto"> 
        {/* Móviles: Relación 3:4 para que todas midan lo mismo sin mucho zoom.
            Computadoras: 'aspect-auto' para que respete el comportamiento que ya tenías.
        */}
        <img
          src={imagen}
          alt={nombre}
          className="h-full w-full object-cover object-center 
                     lg:aspect-auto lg:h-90 lg:w-full
                     group-hover:opacity-75 transition-opacity duration-300"
        />
        
        {/* Etiqueta de Género */}
        <div className="absolute bottom-4 left-2 bg-white/90 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest text-teal-900 border border-teal-900/10 shadow-sm z-10">
          {genero || "Unisex"}
        </div>
      </div>
      
      {/* Contenedor de Información */}
      <div className="mt-4">
        <h3 className="text-sm text-black font-normal">
          <Link to={`/producto/${id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {nombre}
          </Link>
        </h3>
        
        <p className="mt-1 text-sm font-medium text-black">
          ${precio}
        </p>
      </div>
    </div>
  );
}