// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            
            if (token && storedUser) {
                try {
                    // Verify token with backend
                    const response = await authAPI.getMe();
                    setUser(response.data.user);
                } catch (err) {
                    // Token invalid, clear storage
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Register function
    const register = async (userData) => {
        setError(null);
        try {
            const response = await authAPI.register(userData);
            
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                return { success: true, data: user };
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Registration failed";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Login function
    const login = async (email, password) => {
        setError(null);
        try {
            const response = await authAPI.login({ email, password });
            
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                return { success: true, data: user };
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Login failed";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setError(null);
    };

    // Update user function
    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateUser,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
        isOrganizer: user?.role === "organizer",
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
