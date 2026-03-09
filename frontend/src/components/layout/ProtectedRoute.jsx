// src/components/layout/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, hasRole } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        // Redirect to unauthorized if role doesn't match
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
