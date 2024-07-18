import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: { username: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      'http://localhost:8000/accounts/login/',
      { email, password },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    setUser({ username: response.data.username });
  };

  const logout = async () => {
    await axios.post(
      'http://localhost:8000/accounts/logout/',
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
