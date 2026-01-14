import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Footer from '../components/footer';

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    nombre: '',
    apellido: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Detiene la recarga del formulario inmediatamente
    setLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nombre: formData.nombre,
              apellido: formData.apellido,
            },
          },
        });

        if (signUpError) throw signUpError;

        alert(
          "¡Registro casi completado! 📧\n\n" +
          "Hemos enviado un correo de confirmación a " + formData.email + ".\n" +
          "Por favor, revisa tu bandeja de entrada para activar tu cuenta."
        );
        
        setIsRegistering(false);
        setFormData({ email: '', password: '', nombre: '', apellido: '' });
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw new Error("Credenciales inválidas o correo no confirmado.");

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw new Error("Error al obtener perfil.");

        profile.role === 'admin' ? navigate('/panelOperador') : navigate('/inicio');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div> 
      <div 
        style={{
          backgroundImage:"url('assets/fondo.png')",
          backgroundBlendMode: "darken",
          backgroundColor:"rgba(0, 0, 0, 0.3)"
        }} 
        className="flex min-h-screen bg-cover flex-col justify-center px-6 py-4 lg:px-8 bg-[CEE3E8]">
        
        <div className='border border-white/30 bg-sky-100/10 px-4 mt-10 sm:mx-auto sm:w-full sm:max-w-sm rounded-xl '>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
            <img src="/assets/iconologo.png" alt="Logo" className="h-auto w-24 lg:w-30 object-content" />
            <h2 className="text-3xl font-light font-serif px-4 tracking-tight text-white">
              {isRegistering ? "Crea tu cuenta" : "Inicia sesión"}
            </h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm p-4">
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-100">Nombre</label>
                    <input
                      name="nombre"
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-100">Apellido</label>
                    <input
                      name="apellido"
                      type="text"
                      required
                      value={formData.apellido}
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-teal-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-100">Correo electrónico</label>
                <div className="mt-2">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-teal-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Contraseña</label>
                <div className="mt-2">
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-teal-500 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500/70 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {loading ? "Cargando..." : (isRegistering ? "Registrarse" : "Entrar")}
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-gray-400">
              {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{' '}
              <button 
                type="button" // <--- Importante: evita que se envíe el form
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
                className="font-semibold text-indigo-400 hover:text-indigo-300 bg-transparent border-none cursor-pointer"
              >
                {isRegistering ? "Inicia sesión" : "Registráte"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}