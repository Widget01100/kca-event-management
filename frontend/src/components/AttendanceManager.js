import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AttendanceManager = ({ eventId, eventTitle, onClose }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        rate: 0
    });

    useEffect(() => {
        fetchRegistrations();
    }, [eventId]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const data = await api.getEventRegistrations(eventId);
            const regs = data.data || [];
            setRegistrations(regs);
            
            const present = regs.filter(r => r.attendance_marked).length;
            setStats({
                total: regs.length,
                present: present,
                absent: regs.length - present,
                rate: regs.length ? Math.round((present / regs.length) * 100) : 0
            });
        } catch (error) {
            setError(error.message || 'Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (registrationId) => {
        try {
            await api.markAttendance(registrationId);
            await fetchRegistrations(); // Refresh data
        } catch (error) {
            alert('Error marking attendance: ' + error.message);
        }
    };

    const handleMarkAll = async () => {
        if (!window.confirm('Mark all students as present?')) return;
        
        const unmarked = registrations.filter(r => !r.attendance_marked);
        for (const reg of unmarked) {
            await handleMarkAttendance(reg.id);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading attendance data...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Attendance: {eventTitle}</h3>
                <button style={styles.closeButton} onClick={onClose}>×</button>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.total}</div>
                    <div style={styles.statLabel}>Total Registered</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.present}</div>
                    <div style={styles.statLabel}>Present</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.absent}</div>
                    <div style={styles.statLabel}>Absent</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.rate}%</div>
                    <div style={styles.statLabel}>Attendance Rate</div>
                </div>
            </div>

            {registrations.length > 0 && (
                <div style={styles.actions}>
                    <button style={styles.markAllButton} onClick={handleMarkAll}>
                        Mark All Present
                    </button>
                </div>
            )}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Registered On</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={styles.noData}>
                                    No registrations for this event
                                </td>
                            </tr>
                        ) : (
                            registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td>{reg.first_name} {reg.last_name}</td>
                                    <td>{reg.email}</td>
                                    <td>{new Date(reg.registered_at).toLocaleDateString()}</td>
                                    <td>
                                        {reg.attendance_marked ? (
                                            <span style={styles.present}>✅ Present</span>
                                        ) : (
                                            <span style={styles.absent}>❌ Absent</span>
                                        )}
                                    </td>
                                    <td>
                                        {!reg.attendance_marked && (
                                            <button 
                                                style={styles.markButton}
                                                onClick={() => handleMarkAttendance(reg.id)}
                                            >
                                                Mark Present
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: {
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #1e3c72'
    },
    title: {
        color: '#1e3c72',
        margin: 0,
        fontSize: '1.2rem'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666',
        ':hover': {
            color: '#dc3545'
        }
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '20px'
    },
    statCard: {
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        textAlign: 'center'
    },
    statNumber: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1e3c72'
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#666',
        marginTop: '5px'
    },
    actions: {
        marginBottom: '20px',
        textAlign: 'right'
    },
    markAllButton: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem'
    },
    present: {
        color: '#10b981',
        fontWeight: 'bold'
    },
    absent: {
        color: '#dc3545',
        fontWeight: 'bold'
    },
    markButton: {
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '0.8rem'
    },
    noData: {
        textAlign: 'center',
        padding: '30px',
        color: '#666'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#1e3c72'
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        color: '#dc3545'
    }
};

export default AttendanceManager;
