import React, { createContext, useContext, useState, useEffect } from "react";

export type RoutePath =
  | "/"
  | "/masuk"
  | "/daftar"
  | "/kebijakan-privasi"
  | "/syarat-ketentuan"
  | "/dashboard"
  | "/library/ide"
  | "/library/hook"
  | "/library/cta"
  | "/library/formula"
  | "/library/broll"
  | "/skrip"
  | "/skrip/baru"
  | "/pengaturan"
  | string;

interface NavigationContextType {
  currentPath: RoutePath;
  navigate: (path: RoutePath) => void;
  user: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    isLoggedIn: boolean;
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      username: string;
      displayName: string;
      avatarUrl?: string;
      isLoggedIn: boolean;
    }>
  >;
  logout: () => void;
  login: (username: string, displayName?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      return pathname && pathname !== "" ? pathname : "/";
    }
    return "/";
  });

  const [user, setUser] = useState({
    username: "rina_kreator",
    displayName: "Rina Setyowati",
    isLoggedIn: true, // Default true for creator flow demo
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: RoutePath) => {
    setCurrentPath(path);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const login = (username: string, displayName?: string) => {
    setUser({
      username,
      displayName: displayName || username,
      isLoggedIn: true,
    });
    navigate("/dashboard");
  };

  const logout = () => {
    setUser({
      username: "",
      displayName: "",
      isLoggedIn: false,
    });
    navigate("/");
  };

  return (
    <NavigationContext.Provider
      value={{ currentPath, navigate, user, setUser, login, logout }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
