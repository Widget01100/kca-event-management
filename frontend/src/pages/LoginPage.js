import React, { useState } from 'react';
import api from '../services/api';
import auth from '../services/auth';

const LoginPage = ({ onLogin, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!auth.validateKCAEmail(email)) {
            setError('Please use a valid KCA email address');
            setLoading(false);
            return;
        }

        try {
            const result = await api.login(email, password);
            if (result.success) {
                auth.setUser(result.user);
                onLogin(result.user);
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (error) {
            setError(error.message || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to your KCA University account</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>KCA Email</label>
                        <input
                            type="email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@students.kca.ac.ke"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div style={styles.error}>{error}</div>
                    )}

                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.switch}>
                    Don't have an account?{' '}
                    <button style={styles.switchButton} onClick={onSwitch}>
                        Sign up here
                    </button>
                </div>

                <div style={styles.testCredentials}>
                    <p style={styles.testTitle}>🎓 Test Credentials</p>
                    <p style={styles.testItem}>student@students.kca.ac.ke / Student123!</p>
                    <p style={styles.testItem}>staff@staff.kca.ac.ke / Staff123!</p>
                    <p style={styles.testItem}>admin@kca.ac.ke / Admin123!</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
    },
    card: {
        background: 'white',
        padding: '3rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
    },
    title: {
        color: '#1e3c72',
        textAlign: 'center',
        marginBottom: '0.5rem'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '2rem'
    },
    formGroup: {
        marginBottom: '1.5rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#333',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem'
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem'
    },
    error: {
        background: '#ffebee',
        color: '#c62828',
        padding: '0.75rem',
        borderRadius: '5px',
        marginBottom: '1rem'
    },
    switch: {
        marginTop: '1.5rem',
        textAlign: 'center',
        color: '#666'
    },
    switchButton: {
        background: 'none',
        border: 'none',
        color: '#7e22ce',
        cursor: 'pointer',
        fontWeight: '600'
    },
    testCredentials: {
        marginTop: '2rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '5px',
        fontSize: '0.9rem'
    },
    testTitle: {
        color: '#1e3c72',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
    },
    testItem: {
        color: '#666',
        marginBottom: '0.25rem'
    }
};

export default LoginPage;
