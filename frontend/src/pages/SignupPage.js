import React, { useState } from 'react';
import api from '../services/api';
import auth from '../services/auth';

const SignupPage = ({ onSignup, onSwitch }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!auth.validateKCAEmail(formData.email)) {
            setError('Please use a valid KCA email address');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const passwordCheck = auth.validatePassword(formData.password);
        if (!passwordCheck.valid) {
            setError(passwordCheck.errors[0]);
            setLoading(false);
            return;
        }

        try {
            const result = await api.register(formData);
            if (result.success) {
                auth.setUser(result.user);
                onSignup(result.user);
            } else {
                setError(result.message || 'Registration failed');
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
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Join the KCA University community</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                style={styles.input}
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                style={styles.input}
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>KCA Email</label>
                        <input
                            type="email"
                            name="email"
                            style={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@students.kca.ac.ke"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Role</label>
                        <select
                            name="role"
                            style={styles.input}
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            style={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 characters"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            style={styles.input}
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={styles.switch}>
                    Already have an account?{' '}
                    <button style={styles.switchButton} onClick={onSwitch}>
                        Sign in here
                    </button>
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
        maxWidth: '500px',
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
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
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
    }
};

export default SignupPage;
