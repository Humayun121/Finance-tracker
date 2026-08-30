import { createContext } from 'react';

export interface AuthContextValue {
  isAuthenticated: boolean;
  /** True while an expired access token is being validated/refreshed on startup. */
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
