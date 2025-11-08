import React, { createContext, useContext, useState, useEffect } from "react";
import BaseUrl from "../config/Base";
const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });
  useEffect(() => {
    const restoreSession = async () => {
      const hasSession = document.cookie.includes('hasSession=true');      
      if (!hasSession) {
        console.log("No session found - skipping refresh token request");
        return;
      }
      try {
        const res = await fetch(`${BaseUrl}/auth/refreshtoken`, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAuth({ user: data.user, token: data.accessToken });
        }
      } catch (err) {
        console.log("Session check failed", err);
      }
    };

    restoreSession();
  }, []);
  const login = async (credentials) => {
    const result = await fetch(`${BaseUrl}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await result.json();
    if (result.ok) {
      setAuth({ user: data.user, token: data.accessToken });
    } else {
      throw new Error(data.message || "Login failed");
    }
  };
  const logout = async () => {
    await fetch(`${BaseUrl}auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAuth({ user: null, token: null });
  };
  const refresh = async () => {
  if (!auth?.user || !auth?.token) return null;

  try {
    const res = await fetch(`${BaseUrl}auth/refreshtoken`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error while refreshing token");

    const data = await res.json();
    setAuth({ user: data.user, token: data.accessToken });
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    setAuth({ user: null, token: null });
    return null;
  }
};
  const getRole = () => auth.user?.role || null;
  return (
    <AuthContext.Provider value={{ auth, login, logout, refresh, getRole }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
