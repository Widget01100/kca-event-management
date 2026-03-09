// src/components/layout/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/" className="nav-logo">
                        🎯 KCA Events
                    </Link>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/events" className="nav-link">Events</Link>
                    
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            {user.role === "admin" && (
                                <Link to="/admin" className="nav-link">Admin</Link>
                            )}
                            <button onClick={logout} className="btn btn-outline nav-link">
                                Logout
                            </button>
                            <span className="user-badge">
                                {user.name} ({user.role})
                            </span>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
