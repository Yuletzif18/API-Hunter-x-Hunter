import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface Usuario {
  id: string;
  username: string;
  rol: 'admin' | 'usuario';
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_AUTH = 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar token guardado al iniciar
  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    try {
      let tokenGuardado: string | null = null;
      
      if (Platform.OS === 'web') {
        tokenGuardado = localStorage.getItem('token');
      } else {
        tokenGuardado = await AsyncStorage.getItem('token');
      }

      if (tokenGuardado) {
        // Verificar token con el servidor
        const response = await fetch(`${API_AUTH}/verificar`, {
          headers: {
            'Authorization': `Bearer ${tokenGuardado}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setToken(tokenGuardado);
          setUsuario(data.usuario);
          console.log('✅ Sesión restaurada:', data.usuario.username);
        } else {
          // Token inválido, limpiar
          await logout();
        }
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUsuario(data.usuario);

        // Guardar token
        if (Platform.OS === 'web') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
        } else {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
        }

        console.log('✅ Login exitoso:', data.usuario.username, 'Rol:', data.usuario.rol);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const logout = async () => {
    setToken(null);
    setUsuario(null);

    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } else {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
    }

    console.log('👋 Sesión cerrada');
  };

  const isAuthenticated = !!token && !!usuario;
  const isAdmin = usuario?.rol === 'admin';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
