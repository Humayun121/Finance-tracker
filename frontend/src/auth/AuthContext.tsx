import { useEffect, useState, type ReactNode } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/auth';
import { refreshAccessToken } from '../api/client';
import { AuthContext } from './authContext';
import {
  AUTH_EXPIRED_EVENT,
  clearTokens,
  getAccessToken,
  isAccessTokenExpired,
  setTokens,
} from './tokenStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAccessToken() !== null);
  const [isLoading, setIsLoading] = useState(
    () => getAccessToken() !== null && isAccessTokenExpired(),
  );

  // On startup, a present-but-expired access token needs a refresh before we can
  // trust isAuthenticated; isLoading gates protected routes until that resolves.
  useEffect(() => {
    if (!isLoading) return;

    let cancelled = false;
    refreshAccessToken().then((newAccess) => {
      if (cancelled) return;
      if (!newAccess) {
        clearTokens();
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isLoading]);

  // The API client fires this when a refresh fails or a refreshed token is still rejected.
  useEffect(() => {
    function handleAuthExpired() {
      setIsAuthenticated(false);
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  async function login(username: string, password: string) {
    const { access, refresh } = await loginRequest(username, password);
    setTokens(access, refresh);
    setIsAuthenticated(true);
  }

  async function register(username: string, email: string, password: string) {
    await registerRequest(username, email, password);
    await login(username, password);
  }

  function logout() {
    clearTokens();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
