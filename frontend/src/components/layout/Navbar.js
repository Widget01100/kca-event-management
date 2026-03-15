import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const getDashboardLink = () => {
        if (!user) return '#';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'staff') return '/staff/dashboard';
        return '/dashboard';
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    KCA University
                </Link>
                
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Home</Link>
                    <Link to="/events" style={styles.link}>Events</Link>
                    
                    {user && (
                        <>
                            <Link to={getDashboardLink()} style={styles.link}>
                                Dashboard
                            </Link>
                            <Link to="/profile" style={styles.link}>
                                Profile
                            </Link>
                        </>
                    )}
                    
                    {user ? (
                        <div style={styles.userSection}>
                            <span style={styles.userName}>
                                {user.firstName} ({user.role})
                            </span>
                            <button onClick={onLogout} style={styles.logoutButton}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={styles.authLinks}>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/signup" style={styles.signupButton}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        color: '#eab308',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none'
    },
    links: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '0.5rem',
        borderRadius: '5px',
        transition: 'background 0.3s'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginLeft: '1rem',
        paddingLeft: '1rem',
        borderLeft: '1px solid rgba(255,255,255,0.3)'
    },
    userName: {
        color: '#eab308',
        fontSize: '0.9rem'
    },
    logoutButton: {
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    authLinks: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    signupButton: {
        background: '#eab308',
        color: '#1e3c72',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        fontWeight: 'bold'
    }
};

export default Navbar;
