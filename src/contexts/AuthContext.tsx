import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getAuthToken, setAuthToken } from '../api/client';
import { getMe, login, logout, refreshToken } from '../api/auth';
import type { ApiUser } from '../api/types';

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const token = getAuthToken();
      if (!token) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getMe();
        if (isMounted) {
          setUser(response.user);
        }
      } catch (err) {
        setAuthToken(null);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (payload: { email: string; password: string }) => {
    const response = await login(payload);
    setUser(response.user);
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  const refresh = async () => {
    await refreshToken();
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
};
