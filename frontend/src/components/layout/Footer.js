import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    <div style={styles.section}>
                        <h4 style={styles.title}>KCA University</h4>
                        <p style={styles.motto}>"Advancing Knowledge, Driving Change"</p>
                        <p style={styles.copyright}>
                            © 2026 Francis Tom (23/05349)<br />
                            DIT 503 Project
                        </p>
                    </div>
                    <div style={styles.section}>
                        <h4 style={styles.title}>Quick Links</h4>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>Home</li>
                            <li style={styles.listItem}>Events</li>
                            <li style={styles.listItem}>Dashboard</li>
                        </ul>
                    </div>
                    <div style={styles.section}>
                        <h4 style={styles.title}>Contact</h4>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>📧 events@kca.ac.ke</li>
                            <li style={styles.listItem}>📞 +254 123 456 789</li>
                            <li style={styles.listItem}>📍 Nairobi, Kenya</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        background: '#1e3c72',
        color: 'white',
        padding: '3rem 0 1.5rem',
        marginTop: '2rem'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
    },
    section: {
        textAlign: 'left'
    },
    title: {
        color: '#eab308',
        marginBottom: '1rem',
        fontSize: '1.2rem'
    },
    motto: {
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'italic',
        marginBottom: '1rem'
    },
    copyright: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.9rem'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    listItem: {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '0.5rem',
        cursor: 'pointer'
    }
};

export default Footer;
