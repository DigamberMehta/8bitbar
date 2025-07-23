import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        // If not JSON, fallback
        data = {};
      }
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      } else if (data.message) {
        return { success: false, error: data.message };
      } else if (response.status === 429) {
        return {
          success: false,
          error: "Too many requests, please try again later.",
        };
      } else {
        return {
          success: false,
          error:
            "Login failed. Please check your connection or try again later.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again later.",
      };
    }
  };

  const signup = async (name, email, password, dob) => {
    try {
      const body = dob
        ? { name, email, password, dob }
        : { name, email, password };
      const response = await fetch(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }
      if (response.ok && data.success) {
        // Auto-login after successful signup
        const loginResult = await login(email, password);
        if (loginResult.success) {
          return { success: true };
        } else {
          return {
            success: false,
            error: loginResult.error || "Auto-login failed",
          };
        }
      } else if (data.message) {
        return { success: false, error: data.message };
      } else if (response.status === 429) {
        return {
          success: false,
          error: "Too many requests, please try again later.",
        };
      } else {
        return {
          success: false,
          error:
            "Signup failed. Please check your connection or try again later.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again later.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignore network errors on logout
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
