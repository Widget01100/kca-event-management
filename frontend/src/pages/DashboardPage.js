import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardPage = ({ user, events }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const data = await api.getUserRegistrations();
            setRegistrations(data.data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this registration?')) {
            try {
                await api.cancelRegistration(id);
                alert('Registration cancelled');
                fetchRegistrations();
            } catch (error) {
                alert(error.message || 'Cancellation failed');
            }
        }
    };

    const userEvents = events.filter(e => e.created_by === user.id);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.welcome}>Welcome, {user.firstName}!</h1>
                <div style={styles.userInfo}>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> <span style={styles.roleBadge}>{user.role}</span></p>
                </div>
            </div>

            {user.role === 'student' && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>My Registered Events</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : registrations.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>You haven't registered for any events yet.</p>
                        </div>
                    ) : (
                        <div style={styles.list}>
                            {registrations.map(reg => (
                                <div key={reg.id} style={styles.card}>
                                    <div>
                                        <h3 style={styles.eventTitle}>{reg.title}</h3>
                                        <p style={styles.eventMeta}>
                                            📅 {new Date(reg.date).toLocaleDateString()} | 📍 {reg.venue}
                                        </p>
                                        <p style={styles.eventDate}>
                                            Registered: {new Date(reg.registered_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button 
                                        style={styles.cancelButton}
                                        onClick={() => handleCancel(reg.id)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(user.role === 'staff' || user.role === 'admin') && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Events I Created</h2>
                    {userEvents.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>You haven't created any events yet.</p>
                        </div>
                    ) : (
                        <div style={styles.list}>
                            {userEvents.map(event => (
                                <div key={event.id} style={styles.card}>
                                    <div>
                                        <h3 style={styles.eventTitle}>{event.title}</h3>
                                        <p style={styles.eventMeta}>
                                            📅 {event.date} | 📍 {event.venue}
                                        </p>
                                        <p style={styles.eventStats}>
                                            Registered: {event.registered}/{event.capacity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 0'
    },
    header: {
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem'
    },
    welcome: {
        marginBottom: '1rem',
        color: 'white'
    },
    userInfo: {
        background: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '5px'
    },
    roleBadge: {
        background: '#eab308',
        color: '#1e3c72',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginLeft: '0.5rem'
    },
    section: {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
    },
    sectionTitle: {
        color: '#1e3c72',
        marginBottom: '1.5rem'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    card: {
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    eventTitle: {
        color: '#1e3c72',
        marginBottom: '0.25rem'
    },
    eventMeta: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.25rem'
    },
    eventDate: {
        color: '#666',
        fontSize: '0.8rem'
    },
    eventStats: {
        color: '#666',
        fontSize: '0.9rem'
    },
    cancelButton: {
        background: '#ff4444',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666'
    }
};

export default DashboardPage;
