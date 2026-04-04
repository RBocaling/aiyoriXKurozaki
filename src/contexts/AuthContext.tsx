import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CREDS = { username: "admin", password: "admin123" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("slz_auth") === "1");

  const login = (user: string, pass: string) => {
    if (user === CREDS.username && pass === CREDS.password) {
      setIsLoggedIn(true);
      sessionStorage.setItem("slz_auth", "1");
      return true;
    }
    return false;
  };

  const logout = () => { setIsLoggedIn(false); sessionStorage.removeItem("slz_auth"); };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
