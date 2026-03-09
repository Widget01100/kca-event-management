import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field
        setErrors({ ...errors, [e.target.name]: '', general: '' });
    };

    const validateForm = () => {
        const newErrors = {};

        // First name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!authService.validateKCAEmail(formData.email)) {
            newErrors.email = 'Please use a valid KCA University email address';
        }

        // Password validation
        const passwordValidation = authService.validatePassword(formData.password);
        if (!passwordValidation.valid) {
            newErrors.password = passwordValidation.errors[0];
        }

        // Confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const result = await apiService.register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role
            });

            if (result.success) {
                // Auto login after successful registration
                const loginResult = await authService.login(formData.email, formData.password);
                
                if (loginResult.success) {
                    const user = loginResult.user;
                    if (user.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (user.role === 'staff') {
                        navigate('/staff/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                }
            }
        } catch (error) {
            setErrors({ 
                general: error.message || 'Registration failed. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ 
            maxWidth: '600px', 
            paddingTop: '2rem', 
            paddingBottom: '4rem' 
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '1rem',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: '#1e3c72', marginBottom: '0.5rem' }}>
                        Create Account
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Join the KCA University community
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className={`form-control ${errors.firstName ? 'error' : ''}`}
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.firstName && (
                                <div className="error-message">{errors.firstName}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className={`form-control ${errors.lastName ? 'error' : ''}`}
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.lastName && (
                                <div className="error-message">{errors.lastName}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">KCA Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? 'error' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@students.kca.ac.ke"
                            disabled={loading}
                        />
                        {errors.email ? (
                            <div className="error-message">{errors.email}</div>
                        ) : (
                            <div className="kca-email-hint">
                                Use your university email (@kca.ac.ke, @students.kca.ac.ke, or @staff.kca.ac.ke)
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${errors.password ? 'error' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 characters with uppercase and number"
                            disabled={loading}
                        />
                        {errors.password ? (
                            <div className="error-message">{errors.password}</div>
                        ) : (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                Password must be at least 8 characters, contain one uppercase letter and one number
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <div className="error-message">{errors.confirmPassword}</div>
                        )}
                    </div>

                    {errors.general && (
                        <div style={{ 
                            padding: '1rem', 
                            background: '#fef2f2', 
                            color: '#ef4444', 
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            border: '1px solid #fee2e2'
                        }}>
                            {errors.general}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ 
                            width: '100%', 
                            padding: '1rem',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div style={{ 
                        marginTop: '1.5rem', 
                        textAlign: 'center',
                        color: '#6b7280'
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#7e22ce', fontWeight: '600' }}>
                            Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
