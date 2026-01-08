import { Link } from "react-router-dom";

export default function TarjetaProducto({ id, nombre, precio, color, imagen }) {
  return (
    <div className="group relative">
      {/* Imagen del Producto */}
      <img
        src={imagen}
        alt={nombre}
        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-120"
      />
      
      {/* Contenedor de Información */}
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/producto/${id}`}>
              <span aria-hidden="true" className="absolute inset-0"></span>
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