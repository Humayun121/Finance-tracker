import { useState, type ReactNode } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/auth';
import { AuthContext } from './authContext';
import { clearTokens, getAccessToken, setTokens } from './tokenStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAccessToken() !== null);

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
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
