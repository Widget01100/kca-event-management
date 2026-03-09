import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = ({ user, events, onEventUpdate }) => {
    const [users, setUsers] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [activeTab, setActiveTab] = useState('events');

    useEffect(() => {
        fetchUsers();
        fetchRegistrations();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const data = await api.getAllRegistrations();
            setRegistrations(data.data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.deleteEvent(id);
                alert('Event deleted');
                onEventUpdate();
            } catch (error) {
                alert(error.message || 'Delete failed');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.welcome}>Admin Dashboard</h1>
                <p style={styles.subtitle}>System Overview</p>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{users.length}</div>
                    <div style={styles.statLabel}>Users</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{events.length}</div>
                    <div style={styles.statLabel}>Events</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{registrations.length}</div>
                    <div style={styles.statLabel}>Registrations</div>
                </div>
            </div>

            <div style={styles.tabs}>
                <button 
                    style={activeTab === 'events' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('events')}
                >
                    Events
                </button>
                <button 
                    style={activeTab === 'users' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    style={activeTab === 'registrations' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('registrations')}
                >
                    Registrations
                </button>
            </div>

            <div style={styles.content}>
                {activeTab === 'events' && (
                    <div style={styles.tableContainer}>
                        <h3>All Events</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Venue</th>
                                    <th>Registered</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.id}</td>
                                        <td>{event.title}</td>
                                        <td>{event.date}</td>
                                        <td>{event.venue}</td>
                                        <td>{event.registered}/{event.capacity}</td>
                                        <td>
                                            <button 
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div style={styles.tableContainer}>
                        <h3>All Users</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.first_name} {user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span style={roleStyles[user.role]}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'registrations' && (
                    <div style={styles.tableContainer}>
                        <h3>All Registrations</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Event</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Attended</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(reg => (
                                    <tr key={reg.id}>
                                        <td>{reg.email}</td>
                                        <td>{reg.event_title}</td>
                                        <td>{new Date(reg.event_date).toLocaleDateString()}</td>
                                        <td>{reg.status}</td>
                                        <td>{reg.attendance_marked ? '✅' : '❌'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const roleStyles = {
    student: {
        background: '#10b981',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem'
    },
    staff: {
        background: '#7e22ce',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem'
    },
    admin: {
        background: '#ef4444',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem'
    }
};

const styles = {
    container: {
        maxWidth: '1200px',
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
        marginBottom: '0.5rem',
        color: 'white'
    },
    subtitle: {
        opacity: 0.9
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
    },
    statCard: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    statNumber: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1e3c72'
    },
    statLabel: {
        color: '#666'
    },
    tabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    tab: {
        padding: '0.75rem 1.5rem',
        background: '#ddd',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    activeTab: {
        padding: '0.75rem 1.5rem',
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    content: {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem'
    },
    deleteButton: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '0.25rem 0.75rem',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default AdminDashboard;
