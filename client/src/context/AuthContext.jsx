import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize token from localStorage once
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Force refresh auth state from localStorage (used after manual storage changes)
  const refreshAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      setToken(null);
      setUser(null);
    }
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await api.get("/users/profile");
      const freshUser = res.data.user;
      setUser(freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
    } catch (err) {
      console.error("Profile fetch failed", err);
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    if (token && !user) fetchProfile();
  }, [token]);

  const login = async (data, navigate) => {
    try {
      const res = await api.post("/auth/login", data);
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      showSuccess("Login Successful 🎉");
      if (newUser.role === "admin") navigate("/admin/dashboard");
      else if (newUser.role === "staff") navigate("/staff/dashboard");
      else navigate("/");
    } catch (err) {
      showError(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (data, navigate) => {
    try {
      await api.post("/auth/register", data);
      showSuccess("Registered Successfully! Please login.");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Register failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin: user?.role === "admin",
        isStaff: user?.role === "staff",
        isUser: user?.role === "user",
        role: user?.role,
        login,
        register,
        logout,
        refreshAuth,
        refetchUser: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);