import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { MdOutlinePayments, MdOutlineSecurity } from "react-icons/md";
import Footer from "../components/footer"; // Ajusta la ruta según tu proyecto

export default function Contacto() {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/ambos_nkmed",
      icon: <FaInstagram size="1.5em" />,
      label: "@ambos_nkmed",
      desc: "Seguinos para ver las últimas tendencias."
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/5493875875938",
      icon: <FaWhatsapp size="1.5em" />,
      label: "+54 9 387 587-5938",
      desc: "Atención inmediata por chat."
    },
    {
      name: "Email",
      href: "mailto:Nkmed1925@gmail.com",
      icon: <SiGmail size="1.5em" />,
      label: "Nkmed1925@gmail.com",
      desc: "Consultas corporativas y presupuestos."
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col font-serif">
    
      <main className="flex-grow max-w-7xl  mb-10 mt-12 mx-auto w-full px-6 py-18 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* SECCIÓN 1: VÍAS DE COMUNICACIÓN */}
          <div className="space-y-12">
            <div>
              <span className="text-teal-600 font-bold uppercase tracking-widest text-sm">Comunicate con nosotros</span>
              <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 font-light uppercase">Estamos para ayudarte</h2>
            </div>

            <div className="grid gap-8">
              {socialLinks.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-6 group"
                >
                  <div className="p-4 bg-slate-100 text-teal-700 rounded-sm group-hover:bg-teal-700 group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{item.name}</h4>
                    <p className="text-teal-600 font-medium mb-1">{item.label}</p>
                    <p className="text-slate-500 text-sm font-light italic">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: CONDICIONES DE PAGO */}
          <div className="bg-slate-50 p-8 lg:p-12 border border-slate-100 rounded-sm flex flex-col justify-center">
            <div className="mb-8">
              <MdOutlinePayments className="text-teal-600 w-12 h-12 mb-4" />
              <h3 className="text-2xl text-slate-900 uppercase tracking-tight font-light mb-4">Condiciones de Pago</h3>
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed font-light">
                  Para brindarte la mejor calidad al mejor precio, trabajamos con métodos de pago directos y seguros.
                </p>
                <div className="bg-white p-6 border-l-4 border-teal-500 shadow-sm">
                  <p className="text-slate-800 font-medium italic">
                    "Aceptamos pagos únicamente en efectivo o mediante transferencia bancaria."
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-4 text-slate-400">
                <MdOutlineSecurity className="w-6 h-6 shrink-0" />
                <p className="text-[11px] uppercase tracking-widest leading-tight">
                  Tu compra es segura. Una vez realizado el pago, envíanos el comprobante vía WhatsApp para procesar tu pedido.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}