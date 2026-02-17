import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../lib/api";
import { User, AuthResponse } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // We assume /dashboard returns { user: ... } based on your description
      const { data } = await api.get("/dashboard");
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string, email: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_email", email);
    setIsLoading(true);
    await fetchUser(); // Fetch user details immediately after setting token
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout,
        refreshUser: fetchUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};