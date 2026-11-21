import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../api/client';
import { AUTH_STORAGE_KEY } from '../api/storage';

const AuthContext = createContext(null);

function readSessionFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.usuario) return null;

    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

/**
 * Proveedor global del estado de autenticacion.
 * Persiste token y usuario en LocalStorage para sobrevivir recargas.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSessionFromStorage);

  const persistSession = useCallback((authResponse) => {
    const nextSession = {
      token: authResponse.token,
      tokenType: authResponse.tokenType,
      expiresIn: authResponse.expiresIn,
      usuario: authResponse.usuario,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);

    return nextSession;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      return persistSession(data);
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      return persistSession(data);
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(() => {
    const usuario = session?.usuario ?? null;
    const rol = usuario?.rol ?? null;

    return {
      session,
      token: session?.token ?? null,
      usuario,
      rol,
      isAuthenticated: Boolean(session?.token),
      isAdmin: rol === 'ROLE_ADMIN',
      isUser: rol === 'ROLE_USER',
      login,
      register,
      logout,
    };
  }, [session, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }

  return context;
}
