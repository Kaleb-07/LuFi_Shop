import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (current_password: string, password: string, password_confirmation: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) { setUser(null); return; }
      const data = await apiFetch<User>("/user");
      setUser(data);
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string; user: User }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("auth_token", res.access_token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    const res = await apiFetch<{ access_token: string; user: User }>("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
    localStorage.setItem("auth_token", res.access_token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await apiFetch<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setUser(updated);
  };

  const updatePassword = async (current_password: string, password: string, password_confirmation: string) => {
    await apiFetch("/user/password", {
      method: "PUT",
      body: JSON.stringify({ current_password, password, password_confirmation }),
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, updatePassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
