import React from "react";
// Importamos los íconos necesarios de react-icons
import { FaInstagram, FaWhatsapp, FaPhone} from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  // Array actualizado: solo Instagram y WhatsApp
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/ambos_nkmed",
      icon: <FaInstagram size="1.2em" />,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/5493875875938", // numero de texmaigel
      icon: <FaWhatsapp size="1.2em" />,
    },
    {
      name: "Email",
      href:"mailto:Nkmed1925@gmail.com", //email
      icon: <SiGmail size="1.2em"/>,
      text:   <span > </span>,

    }
  ];

  return (
    <footer className="bg-black text-white  border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* SECCIÓN IZQUIERDA: Marca y Copyright */}
          <div className="text-center md:text-left space-y-3">
            <h2 className="text-2xl tracking-widest  font-bold uppercase">
              NK med <span className=" italic font-serif text-teal-500">Ambos clínicos</span>
            </h2>
            <p className="text-sm opacity-60 font-light">
              &copy; {new Date().getFullYear()} Todos los derechos reservados.
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">
              Calidad Premium en Indumentaria Médica
            </p>
          </div>

          

          {/* SECCIÓN DERECHA: Redes Sociales */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] opacity-60">Contactos</span>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-3 bg-white/10 rounded-full  hover:bg-white/20  hover:text-teal-400 transition-all duration-300"
                >
                    <div className=" flex ">
                    <div>
                  {social.icon}
                    </div>
                    <div className="">
                  {social.text}
                    </div>
                    </div>
                </a>
                
              ))}
            </div>
            <div className=""><p>Nkmed1925@gmail.com</p></div>
          </div>

        </div>

        {/* Línea decorativa final */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] opacity-30 uppercase tracking-widest italic">
            Diseño exclusivo para profesionales de la salud
          </p>
        </div>
      </div>
    </footer>
  );
}
