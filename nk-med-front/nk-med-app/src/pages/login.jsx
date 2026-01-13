import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import { supabase } from '../lib/supabase';    // Tu cliente configurado
import Footer from '../components/footer';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null); // Estado para mostrar errores
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Intentar iniciar sesión en Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError("Credenciales inválidas");
      setLoading(false);
      return;
    }

    // 2. Si el login es exitoso, buscamos el rol en la tabla 'profiles'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      setError("Error al obtener perfil");
      setLoading(false);
      return;
    }

    // 3. Redirección lógica según el rol
    if (profile.role === 'admin') {
      navigate('/panelOperador');
    } else {
      navigate('/inicio');
    }
  };

        {/*backgroundImage:"url('assets/fondo.png')",
        backgroundBlendMode: "darken",*/ }

  return (
    <div> 
    <div 
    style={{
      backgroundImage:"url('assets/fondo.png')",
        backgroundBlendMode: "darken",
        backgroundColor:"rgba(0, 0, 0, 0.3)"

    }} 
    className="flex min-h-screen bg-cover  flex-col justify-center px-6 py-4 lg:px-8 bg-[CEE3E8]">
    <div className='border border-white/30  bg-sky-100/10  px-4  mt-10 sm:mx-auto sm:w-full sm:max-w-sm  rounded-xl '>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
        <img 
              src="/assets/iconologo.png" 
              alt="Logo" 
              className="h-auto w-24 lg:w-30 object-content  " 
            />
        <h2 className="  text-3xl  font-light font-serif  px-4 tracking-tight   text-white">
          Inicia sesión 
        </h2>
      </div>

      <div className=" sm:mx-auto sm:w-full sm:max-w-sm  p-4">
      
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
    

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-100">
              Correo electrónico
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                Contraseña
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Entrar"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Registrate
          </a>
        </p>
      </div>
      </div>
    </div>
      <Footer/>
    </div>
  );
}