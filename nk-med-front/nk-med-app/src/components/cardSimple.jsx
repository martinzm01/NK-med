import { Link } from "react-router-dom";

export default function TarjetaProducto({ id, nombre, precio, color, imagen }) {
  return (
    <div className="group relative">
      {/* Imagen del Producto - Se mantiene tu estilo exacto */}
      <div className="overflow-hidden rounded-md bg-white">
        <img
          src={imagen}
          alt={nombre}
          className="lg:aspect-auto aspect-square w-full object-cover group-hover:opacity-75 lg:h-80 transition-opacity duration-300"
        />
      </div>
      
      {/* Contenedor de Información */}
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            {/* El Link ahora apunta a la ruta dinámica /producto/:id */}
            <Link to={`/producto/${id}`}>
              {/* Esta span hace que TODO el área de la card sea clickeable sin cambiar el diseño */}
              <span aria-hidden="true" className="absolute inset-0" />
              {nombre}
            </Link>
          </h3>
          {/* Campo Color */}
          <p className="mt-1 text-sm text-gray-500">{color}</p>
        </div>
        
        {/* Campo Precio */}
        <p className="text-sm font-medium text-gray-900">${precio}</p>
      </div>
    </div>
  );
}