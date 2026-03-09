import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate KCA email
        if (!authService.validateKCAEmail(email)) {
            setError('Please use a valid KCA University email address (@kca.ac.ke, @students.kca.ac.ke, or @staff.kca.ac.ke)');
            setLoading(false);
            return;
        }

        // Validate password not empty
        if (!password) {
            setError('Please enter your password');
            setLoading(false);
            return;
        }

        try {
            const result = await authService.login(email, password);
            
            if (result.success) {
                // Redirect based on role
                const user = result.user;
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'staff') {
                    navigate('/staff/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ 
            maxWidth: '500px', 
            paddingTop: '4rem', 
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
                        Welcome Back
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Sign in to your KCA University account
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">KCA Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            placeholder="student@students.kca.ac.ke"
                            required
                            disabled={loading}
                        />
                        <div className="kca-email-hint">
                            Use your <strong>@kca.ac.ke</strong>, <strong>@students.kca.ac.ke</strong>, or <strong>@staff.kca.ac.ke</strong> email
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div style={{ 
                            padding: '1rem', 
                            background: '#fef2f2', 
                            color: '#ef4444', 
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            border: '1px solid #fee2e2'
                        }}>
                            {error}
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div style={{ 
                        marginTop: '1.5rem', 
                        textAlign: 'center',
                        color: '#6b7280'
                    }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#7e22ce', fontWeight: '600' }}>
                            Sign up here
                        </Link>
                    </div>
                </form>

                {/* Test Credentials */}
                <div style={{ 
                    marginTop: '2rem', 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '0.75rem' 
                }}>
                    <p style={{ fontWeight: '600', color: '#1e3c72', marginBottom: '1rem' }}>
                        🎓 Test Credentials
                    </p>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem' }}>
                            <strong style={{ color: '#10b981' }}>Student:</strong>
                            <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                student@students.kca.ac.ke / Student123!
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem' }}>
                            <strong style={{ color: '#7e22ce' }}>Staff:</strong>
                            <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                staff@staff.kca.ac.ke / Staff123!
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem' }}>
                            <strong style={{ color: '#ef4444' }}>Admin:</strong>
                            <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                admin@kca.ac.ke / Admin123!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
