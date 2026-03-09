// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        
        if (!email || !password) {
            setFormError("Please fill in all fields");
            return;
        }

        setLoading(true);
        
        const result = await login(email, password);
        
        setLoading(false);
        
        if (result.success) {
            navigate("/dashboard");
        } else {
            setFormError(result.error || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login to KCA Events</h2>
                <p className="auth-subtitle">Enter your credentials to access your account</p>
                
                {(formError || error) && (
                    <div className="alert alert-error">
                        {formError || error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@kca.ac.ke"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <Link to="/password-reset" className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="auth-link">
                            Sign up here
                        </Link>
                    </p>
                    <p className="auth-note">
                        Use your KCA University email address
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
