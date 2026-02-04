import { createContext, useState, ReactNode } from 'react';
import type { Utilisateur } from '../types';

interface AuthContextType {
  user: Utilisateur | null;
  setUser: (user: Utilisateur | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Utilisateur | null>(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated: user !== null,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
