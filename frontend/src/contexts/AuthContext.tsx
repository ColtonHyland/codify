import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: { username: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login/",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { key: token } = response.data;
      const userResponse = await axios.get("http://localhost:8000/api/auth/user/", {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      localStorage.setItem('token', token);
      setUser({ username: userResponse.data.username, email: userResponse.data.email });
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Login error data:", error.response.data);
        throw new Error(JSON.stringify(error.response.data));
      } else {
        console.error("Login error:", error);
      }
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/registration/",
        { username, email, password1: password, password2: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { key: token } = response.data;
      const userResponse = await axios.get("http://localhost:8000/api/auth/user/", {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      localStorage.setItem('token', token);
      setUser({ username: userResponse.data.username, email: userResponse.data.email });
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Signup error data:", error.response.data);
        throw new Error(JSON.stringify(error.response.data));
      } else {
        console.error("Signup error:", error);
      }
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      "http://localhost:8000/api/auth/logout/",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      }
    );
    localStorage.removeItem('token');
    setUser(null);
    navigate("/login");
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await axios.post("http://localhost:8000/api/auth/registration/resend-email/", { email });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Resend verification email error data:", error.response.data);
        throw new Error(JSON.stringify(error.response.data));
      } else {
        console.error("Resend verification email error:", error);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/auth/user/",
            {
              headers: {
                "Authorization": `Token ${token}`,
              },
            }
          );
          if (response.data.username && response.data.email) {
            setUser({ username: response.data.username, email: response.data.email });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Check auth error:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resendVerificationEmail }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
