import { Link } from "react-router-dom";
// Importamos iconos relevantes para un hotel
import { LayoutGrid, CalendarCheck, MessageSquare,ShoppingCart} from "lucide-react";
export default function PanelOperador() {
    return (
    <div
    style={{
        backgroundImage:"url('assets/fondo.png')",
        backgroundBlendMode: "darken", 
        backgroundColor:"rgba(0, 0, 0, 0.3)"
    }} 
    // Hice un pequeño ajuste aquí: 
    // Agregué 'relative' por si en el futuro quieres posicionar
    // algo de forma absoluta DENTRO de este div. Para 'fixed', no es
    // necesario, pero es una buena práctica.
    className="min-h-screen relative bg-cover bg-center  w-full  via-gray-950 to-black text-white flex flex-col items-center justify-center px-6 py-10">
    
    {/* --- INICIO: Logo en la esquina --- */}
    {/*
      - fixed:  Posición fija en la ventana.
      - top-5:  A 1.25rem (20px) del borde superior.
      - left-5: A 1.25rem (20px) del borde izquierdo.
    */}
    <div className="fixed top-5 left-5">
        {/*
          - La ruta 'assets/iconologo.png' asume que está en la carpeta 'public/assets',
            igual que tu 'fondo.png'.
          - w-24 es 6rem (96px). Puedes ajustarlo (ej: w-20, w-28).
        */}
        <img 
            src="assets/iconologo.png" 
            alt="Logo" 
            className="w-40 h-auto" 
        />
    </div>
    {/* --- FIN: Logo en la esquina --- */}


    {/* Título principal adaptado al rol */}
    <h1 className="text-4xl md:text-7xl mb-20 font-medium  tracking-wide text-center font-serif">
        Panel del Operador 
    </h1>

    {/* Contenedor de los 3 frames */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        
        {/* Frame 1: Mapa de Ocupación */}
        <Link
        to="/catalogo"
        className="group bg-gray-950/50 hover:bg-gray-700/50 rounded-2xl shadow-lg p-8 text-center flex flex-col items-center transition-transform transform hover:scale-105"
        >
        <ShoppingCart className="w-16 h-16 mb-4 text-blue-400 group-hover:animate-pulse" />
        <h2 className="text-2xl font-medium mb-2 font-serif">Realizar una Venta</h2>
        <p className="text-gray-300 text-sm">
            Entra aquí para ver el catalogo y realizar una venta.
        </p>
        </Link>

        {/* Frame 2: Gestión de Reservas */}
        <Link
        to="/reservas"
        className="group bg-gray-950/50 hover:bg-gray-700/50 rounded-2xl shadow-lg p-8 text-center flex flex-col items-center transition-transform transform hover:scale-105"
        >
        <CalendarCheck className="w-16 h-16 mb-4 text-green-400 group-hover:animate-pulse" />
        <h2 className="text-2xl font-medium mb-2 font-serif">Gestión de Reservas</h2>
        <p className="text-gray-300 text-sm">
            Crea, modifica o cancela las reservas de los clientes.
        </p>
        </Link>

        {/* Frame 3: Gestión de Consultas */}
        <Link
        // Usé esta ruta porque la mencionaste en conversaciones anteriores
        to="/AdminConsultas" 
        className="group bg-teal-950/70 hover:bg-teal-700/50 rounded-2xl shadow-lg p-8 text-center flex flex-col items-center transition-transform transform hover:scale-105"
        >
        <MessageSquare className="w-16 h-16 mb-4 text-yellow-400 group-hover:animate-pulse" />
        <h2 className="text-2xl  mb-2 font-medium font-serif">Gestión de Consultas</h2>
        <p className="text-gray-300 text-sm">
            Responde y administra las consultas de los visitantes.
        </p>
        </Link>
    </div>
    </div>
);
}