import { useState, type ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import { AuthContext } from './authContext';
import { clearTokens, getAccessToken, setTokens } from './tokenStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAccessToken() !== null);

  async function login(username: string, password: string) {
    const { access, refresh } = await loginRequest(username, password);
    setTokens(access, refresh);
    setIsAuthenticated(true);
  }

  function logout() {
    clearTokens();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
