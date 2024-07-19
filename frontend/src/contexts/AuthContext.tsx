import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCSRFToken } from "../utils/csrf";

interface AuthContextType {
  user: { username: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const csrfToken = await getCSRFToken();
    const response = await axios.post(
      "http://localhost:8000/accounts/login/",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
    setUser({ username: response.data.username, email: response.data.email });
    navigate("/");
  };

  const signup = async (username: string, email: string, password: string) => {
    const csrfToken = await getCSRFToken();
    const response = await axios.post(
      "http://localhost:8000/accounts/signup/",
      { username, email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
    setUser({ username: response.data.username, email: response.data.email });
    navigate("/");
  };

  const logout = async () => {
    const csrfToken = await getCSRFToken();
    await axios.post(
      "http://localhost:8000/accounts/logout/",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/accounts/user/",
          { withCredentials: true }
        );
        setUser({ username: response.data.username, email: response.data.email });
      } catch (error) {
        console.error("Check auth error:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
