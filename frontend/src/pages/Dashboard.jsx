import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';

export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        
        fetchStudentData();
    }, [navigate]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const [registrationsRes, eventsRes, statsRes] = await Promise.all([
                apiService.getUserRegistrations(),
                apiService.getEvents(),
                apiService.getStats()
            ]);

            setRegistrations(registrationsRes.data || []);
            
            // Get upcoming events (not registered yet)
            const allEvents = eventsRes.data || [];
            const registeredEventIds = new Set(registrationsRes.data?.map(r => r.event_id) || []);
            const upcoming = allEvents
                .filter(e => !registeredEventIds.has(e.id) && new Date(e.date) >= new Date())
                .slice(0, 3);
            setUpcomingEvents(upcoming);
            
            setStats(statsRes.data || {});
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRegistration = async (registrationId) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) {
            return;
        }
        
        try {
            await apiService.cancelRegistration(registrationId);
            alert('Registration cancelled successfully');
            fetchStudentData();
        } catch (error) {
            alert('Error cancelling registration: ' + error.message);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                    <h2>Loading Dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ 
            minHeight: '100vh',
            background: '#f3f4f6',
            paddingBottom: '2rem'
        }}>
            {/* Student Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                color: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
                        🎓 KCA Student Portal
                    </h1>
                    <span style={{
                        background: '#eab308',
                        color: '#1e3c72',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                    }}>
                        STUDENT
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <span>Welcome, {user?.firstName} {user?.lastName}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', maxWidth: '1400px', margin: '2rem auto', gap: '2rem' }}>
                {/* Sidebar Navigation */}
                <div style={{
                    width: '250px',
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    height: 'fit-content'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                            borderRadius: '50%',
                            margin: '0 auto 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '2rem'
                        }}>
                            🎓
                        </div>
                        <h3 style={{ color: '#1e3c72', marginBottom: '0.25rem' }}>
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {user?.email}
                        </p>
                        <span className="university-badge" style={{ marginTop: '0.5rem' }}>
                            Student
                        </span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'dashboard' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                📊 Dashboard
                            </button>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('registrations')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'registrations' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'registrations' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                📋 My Events
                                <span style={{
                                    background: activeTab === 'registrations' ? 'white' : '#7e22ce',
                                    color: activeTab === 'registrations' ? '#7e22ce' : 'white',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    marginLeft: 'auto'
                                }}>
                                    {registrations.length}
                                </span>
                            </button>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <Link
                                to="/events"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: '#4b5563',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                🔍 Browse Events
                            </Link>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <Link
                                to="/calendar"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: '#4b5563',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                📅 Calendar
                            </Link>
                        </li>
                        <li style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <Link
                                to="/"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: '#6b7280',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1rem'
                                }}
                            >
                                🏠 Home
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>
                                Student Dashboard
                            </h2>
                            
                            {/* Stats Overview */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        My Registrations
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {registrations.length}
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        Total Events
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {stats.total_events || 45}
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        Upcoming Events
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {stats.upcoming_events || 12}
                                    </div>
                                </div>
                            </div>

                            {/* My Recent Registrations */}
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                marginBottom: '2rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ color: '#1e3c72' }}>My Recent Registrations</h3>
                                    {registrations.length > 0 && (
                                        <button
                                            onClick={() => setActiveTab('registrations')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#7e22ce',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            View All →
                                        </button>
                                    )}
                                </div>
                                
                                {registrations.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                            You haven't registered for any events yet.
                                        </p>
                                        <Link
                                            to="/events"
                                            className="btn btn-primary"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            Browse Events
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Date</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Venue</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registered</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registrations.slice(0, 5).map(reg => (
                                                    <tr key={reg.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>{reg.title}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(reg.date).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>{reg.venue}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(reg.registered_at).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{
                                                                background: reg.status === 'confirmed' ? '#10b981' : '#ef4444',
                                                                color: 'white',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600'
                                                            }}>
                                                                {reg.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <button
                                                                onClick={() => handleCancelRegistration(reg.id)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: '#ef4444',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.875rem'
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Recommended Events */}
                            {upcomingEvents.length > 0 && (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <h3 style={{ color: '#1e3c72', marginBottom: '1rem' }}>Recommended for You</h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        {upcomingEvents.map(event => (
                                            <div
                                                key={event.id}
                                                style={{
                                                    padding: '1rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                            >
                                                <h4 style={{ fontWeight: '600', color: '#1e3c72', marginBottom: '0.5rem' }}>
                                                    {event.title}
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                    📅 {new Date(event.date).toLocaleDateString()}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                                                    📍 {event.venue}
                                                </p>
                                                <Link
                                                    to={`/event/${event.id}`}
                                                    style={{
                                                        display: 'inline-block',
                                                        background: '#7e22ce',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '0.5rem',
                                                        textDecoration: 'none',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'registrations' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>My Registered Events</h2>
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                {registrations.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                            You haven't registered for any events yet.
                                        </p>
                                        <Link
                                            to="/events"
                                            className="btn btn-primary"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            Browse Events
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event ID</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event Name</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Date</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Time</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Venue</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Category</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registered On</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registrations.map(reg => (
                                                    <tr key={reg.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{reg.event_id}</td>
                                                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>{reg.title}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(reg.date).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>{reg.time}</td>
                                                        <td style={{ padding: '0.75rem' }}>{reg.venue}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{
                                                                background: reg.category === 'Career' ? '#10b981' :
                                                                           reg.category === 'Sports' ? '#f59e0b' :
                                                                           reg.category === 'Technology' ? '#7e22ce' : '#1e3c72',
                                                                color: 'white',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600'
                                                            }}>
                                                                {reg.category}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(reg.registered_at).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{
                                                                background: reg.status === 'confirmed' ? '#10b981' : '#ef4444',
                                                                color: 'white',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600'
                                                            }}>
                                                                {reg.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <button
                                                                onClick={() => handleCancelRegistration(reg.id)}
                                                                style={{
                                                                    background: '#ef4444',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    padding: '0.25rem 0.75rem',
                                                                    borderRadius: '0.25rem',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '600'
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
