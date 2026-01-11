import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase'; // Tu ruta configurada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtiene la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escucha cambios de autenticación
const { data: authListener } = supabase.auth.onAuthStateChange(
  (event, session) => {
    if (event === 'SIGNED_IN') {
      setSession(session);
      // No toques el loading aquí, deja que el useEffect del profile lo maneje
    } else if (event === 'SIGNED_OUT') {
      setSession(null);
      setProfile(null);
      setLoading(false);
    } else {
      setSession(session);
    }
  });

    // 3. Sincronización de pestañas (Solución a tu error de "congelado")
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // useEffect separado para el Perfil y el ROL
  useEffect(() => {
    setLoading(true); 
    
    if (!session) {
      setProfile(null);
      setLoading(false); 
      return;
    }

    // Buscamos en tu tabla 'profiles'
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error al obtener perfil:", error.message);
          setProfile(null);
        } else {
          setProfile(data); 
        }
        setLoading(false);
      });
  }, [session]);

  const logout = async () => {
    await supabase.auth.signOut();
    // No hace falta hacer nada más, onAuthStateChange limpiará la sesión
  };

  // El valor que exponemos incluye 'role' para tus rutas protegidas
  // Usamos profile?.role para que tus componentes funcionen
  const value = { 
    session, 
    user: session?.user, 
    profile, 
    role: profile?.role, 
    loading, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);