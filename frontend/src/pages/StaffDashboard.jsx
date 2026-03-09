import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';

export default function StaffDashboard() {
    const [user, setUser] = useState(null);
    const [myEvents, setMyEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [categories, setCategories] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is staff or admin
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (currentUser.role === 'student') {
            navigate('/dashboard');
            return;
        }
        setUser(currentUser);
        
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes, statsRes, categoriesRes, registrationsRes] = await Promise.all([
                apiService.getEvents(),
                apiService.getStats(),
                apiService.getCategories(),
                apiService.getAllRegistrations()
            ]);

            const allEventsData = eventsRes.data || [];
            setAllEvents(allEventsData);
            
            // Filter events created by this staff member
            const userEvents = allEventsData.filter(event => event.created_by === user?.id);
            setMyEvents(userEvents);
            
            setStats(statsRes.data || {});
            setCategories(categoriesRes.data || []);
            setRegistrations(registrationsRes.data || []);
        } catch (error) {
            console.error('Error fetching staff data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await apiService.createEvent({
                ...selectedEvent,
                created_by: user.id
            });
            alert('Event created successfully');
            setShowEventModal(false);
            fetchData();
        } catch (error) {
            alert('Error creating event: ' + error.message);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateEvent(selectedEvent.id, selectedEvent);
            alert('Event updated successfully');
            setShowEventModal(false);
            fetchData();
        } catch (error) {
            alert('Error updating event: ' + error.message);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }
        
        try {
            await apiService.deleteEvent(eventId);
            alert('Event deleted successfully');
            fetchData();
        } catch (error) {
            alert('Error deleting event: ' + error.message);
        }
    };

    const handleMarkAttendance = async (registrationId) => {
        try {
            await apiService.markAttendance(registrationId);
            alert('Attendance marked successfully');
            fetchData();
        } catch (error) {
            alert('Error marking attendance: ' + error.message);
        }
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
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👔</div>
                    <h2>Loading Staff Dashboard...</h2>
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
            {/* Staff Header */}
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
                        👔 KCA Staff Portal
                    </h1>
                    <span style={{
                        background: '#eab308',
                        color: '#1e3c72',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                    }}>
                        STAFF
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
                            👔
                        </div>
                        <h3 style={{ color: '#1e3c72', marginBottom: '0.25rem' }}>
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <p style={{ color: '#7e22ce', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            University Staff
                        </p>
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
                                📊 Overview
                            </button>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('myevents')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'myevents' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'myevents' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                📅 My Events
                                <span style={{
                                    background: activeTab === 'myevents' ? 'white' : '#7e22ce',
                                    color: activeTab === 'myevents' ? '#7e22ce' : 'white',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    marginLeft: 'auto'
                                }}>
                                    {myEvents.length}
                                </span>
                            </button>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('create')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'create' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'create' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                ➕ Create Event
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
                                📋 Registrations
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
                        <li style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <a
                                href="/"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: '#6b7280',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1rem'
                                }}
                            >
                                🏠 Back to Home
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>Staff Overview</h2>
                            
                            {/* Stats Cards */}
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
                                        My Events
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {myEvents.length}
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
                                        {stats.total_events || allEvents.length}
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        Total Registrations
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {stats.total_registrations || registrations.length}
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
                                        {stats.upcoming_events || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                marginBottom: '2rem'
                            }}>
                                <h3 style={{ color: '#1e3c72', marginBottom: '1rem' }}>Quick Actions</h3>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => {
                                            setSelectedEvent({
                                                title: '',
                                                description: '',
                                                date: '',
                                                time: '',
                                                venue: '',
                                                category: '',
                                                capacity: 100,
                                                organizer: user?.firstName + ' ' + user?.lastName,
                                                image_url: ''
                                            });
                                            setActiveTab('create');
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        ➕ Create New Event
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('myevents')}
                                        style={{
                                            background: 'white',
                                            color: '#1e3c72',
                                            border: '2px solid #1e3c72',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        📅 Manage My Events
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('registrations')}
                                        style={{
                                            background: 'white',
                                            color: '#7e22ce',
                                            border: '2px solid #7e22ce',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        📋 View Registrations
                                    </button>
                                </div>
                            </div>

                            {/* My Recent Events */}
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ color: '#1e3c72' }}>My Recent Events</h3>
                                    <button
                                        onClick={() => setActiveTab('myevents')}
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
                                </div>
                                
                                {myEvents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                            You haven't created any events yet.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedEvent({
                                                    title: '',
                                                    description: '',
                                                    date: '',
                                                    time: '',
                                                    venue: '',
                                                    category: '',
                                                    capacity: 100,
                                                    organizer: user?.firstName + ' ' + user?.lastName,
                                                    image_url: ''
                                                });
                                                setActiveTab('create');
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Create Your First Event
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Date</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Venue</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registrations</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myEvents.slice(0, 5).map(event => (
                                                    <tr key={event.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>{event.title}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>{event.venue}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{ fontWeight: '600', color: event.registered >= event.capacity ? '#ef4444' : '#10b981' }}>
                                                                {event.registered}/{event.capacity}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{
                                                                color: event.status === 'active' ? '#10b981' : '#ef4444',
                                                                fontWeight: '600'
                                                            }}>
                                                                {event.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedEvent(event);
                                                                        setActiveTab('create');
                                                                    }}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#7e22ce',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                            </div>
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

                    {activeTab === 'myevents' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>My Events</h2>
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event ID</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Title</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Venue</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Category</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registrations</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myEvents.map(event => (
                                                <tr key={event.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{event.id}</td>
                                                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{event.title}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>{event.venue}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            background: event.category === 'Career' ? '#10b981' :
                                                                       event.category === 'Sports' ? '#f59e0b' :
                                                                       event.category === 'Technology' ? '#7e22ce' : '#1e3c72',
                                                            color: 'white',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {event.category}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{ fontWeight: '600', color: event.registered >= event.capacity ? '#ef4444' : '#10b981' }}>
                                                            {event.registered}/{event.capacity}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            color: event.status === 'active' ? '#10b981' : '#ef4444',
                                                            fontWeight: '600'
                                                        }}>
                                                            {event.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedEvent(event);
                                                                    setActiveTab('create');
                                                                }}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: '#7e22ce',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteEvent(event.id)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: '#ef4444',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'create' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>
                                {selectedEvent?.id ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '2rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <form onSubmit={selectedEvent?.id ? handleUpdateEvent : handleCreateEvent}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                            Event Title
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedEvent?.title || ''}
                                            onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem'
                                            }}
                                            required
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={selectedEvent?.description || ''}
                                            onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                                            rows="4"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                                resize: 'vertical'
                                            }}
                                            required
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={selectedEvent?.date || ''}
                                                onChange={(e) => setSelectedEvent({...selectedEvent, date: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                                Time
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedEvent?.time || ''}
                                                onChange={(e) => setSelectedEvent({...selectedEvent, time: e.target.value})}
                                                placeholder="09:00 AM - 05:00 PM"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                                Venue
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedEvent?.venue || ''}
                                                onChange={(e) => setSelectedEvent({...selectedEvent, venue: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                                Category
                                            </label>
                                            <select
                                                value={selectedEvent?.category || ''}
                                                onChange={(e) => setSelectedEvent({...selectedEvent, category: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                                Capacity
                                            </label>
                                            <input
                                                type="number"
                                                value={selectedEvent?.capacity || 100}
                                                onChange={(e) => setSelectedEvent({...selectedEvent, capacity: parseInt(e.target.value)})}
                                                min="1"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                                Organizer
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedEvent?.organizer || ''}
                                                onChange={(e) => setSelectedEvent({...selectedEvent, organizer: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                            Image URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={selectedEvent?.image_url || ''}
                                            onChange={(e) => setSelectedEvent({...selectedEvent, image_url: e.target.value})}
                                            placeholder="https://images.unsplash.com/..."
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                        <button
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {selectedEvent?.id ? 'Update Event' : 'Create Event'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedEvent(null);
                                                setActiveTab('dashboard');
                                            }}
                                            style={{
                                                flex: 1,
                                                background: '#e5e7eb',
                                                color: '#4b5563',
                                                border: 'none',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'registrations' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>Event Registrations</h2>
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Student</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registered</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Attendance</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrations.map(reg => (
                                                <tr key={reg.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <div style={{ fontWeight: '600' }}>{reg.first_name} {reg.last_name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{reg.email}</div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <div style={{ fontWeight: '600' }}>{reg.event_title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                            {new Date(reg.event_date).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(reg.registered_at).toLocaleString()}
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
                                                        {reg.attendance_marked ? (
                                                            <span style={{ color: '#10b981', fontWeight: '600' }}>✅ Present</span>
                                                        ) : (
                                                            <span style={{ color: '#f59e0b', fontWeight: '600' }}>⏳ Pending</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {!reg.attendance_marked && (
                                                            <button
                                                                onClick={() => handleMarkAttendance(reg.id)}
                                                                style={{
                                                                    background: '#f59e0b',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    padding: '0.25rem 0.75rem',
                                                                    borderRadius: '0.25rem',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '600'
                                                                }}
                                                            >
                                                                Mark Present
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
