import React from 'react';

const Navbar = ({ currentPage, setCurrentPage, user, onLogout }) => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <div style={styles.logo} onClick={() => setCurrentPage('home')}>
                    <span style={styles.logoText}>KCA University</span>
                </div>
                <div style={styles.links}>
                    <button 
                        style={currentPage === 'home' ? styles.activeLink : styles.link}
                        onClick={() => setCurrentPage('home')}
                    >
                        Home
                    </button>
                    <button 
                        style={currentPage === 'events' ? styles.activeLink : styles.link}
                        onClick={() => setCurrentPage('events')}
                    >
                        Events
                    </button>
                    {user && (
                        <button 
                            style={
                                (currentPage === 'dashboard' || 
                                 currentPage === 'staff' || 
                                 currentPage === 'admin') ? styles.activeLink : styles.link
                            }
                            onClick={() => {
                                if (user.role === 'admin') setCurrentPage('admin');
                                else if (user.role === 'staff') setCurrentPage('staff');
                                else setCurrentPage('dashboard');
                            }}
                        >
                            Dashboard
                        </button>
                    )}
                    {user ? (
                        <>
                            <span style={styles.userInfo}>
                                {user.firstName} ({user.role})
                            </span>
                            <button style={styles.logoutButton} onClick={onLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                style={currentPage === 'login' ? styles.activeLink : styles.link}
                                onClick={() => setCurrentPage('login')}
                            >
                                Login
                            </button>
                            <button 
                                style={currentPage === 'signup' ? styles.activeButton : styles.primaryButton}
                                onClick={() => setCurrentPage('signup')}
                            >
                                Sign Up
                            </button>
                        </>
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
        cursor: 'pointer'
    },
    logoText: {
        color: '#eab308',
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    links: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    link: {
        background: 'none',
        border: 'none',
        color: 'white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '1rem',
        borderRadius: '5px'
    },
    activeLink: {
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        color: 'white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '1rem',
        borderRadius: '5px',
        fontWeight: 'bold'
    },
    primaryButton: {
        background: '#eab308',
        border: 'none',
        color: '#1e3c72',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '1rem',
        borderRadius: '5px',
        fontWeight: 'bold'
    },
    activeButton: {
        background: '#eab308',
        border: 'none',
        color: '#1e3c72',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '1rem',
        borderRadius: '5px',
        fontWeight: 'bold',
        boxShadow: '0 0 0 2px white'
    },
    logoutButton: {
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        color: 'white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '1rem',
        borderRadius: '5px'
    },
    userInfo: {
        color: '#eab308',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem'
    }
};

export default Navbar;
