// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/auth.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
    });
    
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.studentId || !formData.name || !formData.email || !formData.password) {
            return "Please fill in all required fields";
        }
        
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }
        
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters";
        }
        
        // Validate student ID format (e.g., 23/05349)
        const studentIdRegex = /^\d{2}\/\d{5}$/;
        if (!studentIdRegex.test(formData.studentId)) {
            return "Student ID must be in format: YY/XXXXX (e.g., 23/05349)";
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return "Please enter a valid email address";
        }
        
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }
        
        setFormError("");
        setLoading(true);
        
        // Prepare data for backend (remove confirmPassword)
        const { confirmPassword, ...userData } = formData;
        
        const result = await register(userData);
        
        setLoading(false);
        
        if (result.success) {
            navigate("/dashboard");
        } else {
            setFormError(result.error || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join KCA Event Management System</p>
                
                {(formError || error) && (
                    <div className="alert alert-error">
                        {formError || error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="studentId">Student ID *</label>
                        <input
                            type="text"
                            id="studentId"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            placeholder="e.g., 23/05349"
                            required
                            disabled={loading}
                        />
                        <small className="form-hint">Format: YY/XXXXX</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@kca.ac.ke"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="role">Account Type</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="student">Student</option>
                            <option value="organizer">Event Organizer</option>
                        </select>
                        <small className="form-hint">Admin accounts must be created by existing admins</small>
                    </div>
                    
                    <div className="form-checkbox">
                        <label>
                            <input type="checkbox" required />
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
