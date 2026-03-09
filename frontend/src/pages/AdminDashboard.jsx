import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [stats, setStats] = useState({});
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [categories, setCategories] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (currentUser.role !== 'admin') {
            navigate(authService.getDashboardUrl());
            return;
        }
        setUser(currentUser);
        
        fetchAllData();
    }, [navigate]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [usersRes, eventsRes, registrationsRes, statsRes, logsRes, categoriesRes] = await Promise.all([
                apiService.getUsers(),
                apiService.getEvents(),
                apiService.getAllRegistrations(),
                apiService.getStats(),
                apiService.getAuditLogs(),
                apiService.getCategories()
            ]);

            setUsers(usersRes.data || []);
            setEvents(eventsRes.data || []);
            setRegistrations(registrationsRes.data || []);
            setStats(statsRes.data || {});
            setLogs(logsRes.data || []);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        
        try {
            await apiService.deleteUser(userId);
            alert('User deleted successfully');
            fetchAllData();
        } catch (error) {
            alert('Error deleting user: ' + error.message);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateUser(selectedUser.id, selectedUser);
            alert('User updated successfully');
            setShowUserModal(false);
            fetchAllData();
        } catch (error) {
            alert('Error updating user: ' + error.message);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }
        
        try {
            await apiService.deleteEvent(eventId);
            alert('Event deleted successfully');
            fetchAllData();
        } catch (error) {
            alert('Error deleting event: ' + error.message);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateEvent(selectedEvent.id, selectedEvent);
            alert('Event updated successfully');
            setShowEventModal(false);
            fetchAllData();
        } catch (error) {
            alert('Error updating event: ' + error.message);
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
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                    <h2>Loading Admin Dashboard...</h2>
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
            {/* Admin Header */}
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
                        🎓 KCA Admin Panel
                    </h1>
                    <span style={{
                        background: '#eab308',
                        color: '#1e3c72',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                    }}>
                        ADMIN
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
                            ⚙️
                        </div>
                        <h3 style={{ color: '#1e3c72', marginBottom: '0.25rem' }}>
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <p style={{ color: '#7e22ce', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            System Administrator
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
                                    gap: '0.75rem',
                                    fontWeight: activeTab === 'dashboard' ? '600' : '400',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                📊 Dashboard
                            </button>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('users')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'users' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'users' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                👥 User Management
                                <span style={{
                                    background: activeTab === 'users' ? 'white' : '#7e22ce',
                                    color: activeTab === 'users' ? '#7e22ce' : 'white',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    marginLeft: 'auto'
                                }}>
                                    {users.length}
                                </span>
                            </button>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('events')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'events' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'events' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                📅 Event Management
                                <span style={{
                                    background: activeTab === 'events' ? 'white' : '#7e22ce',
                                    color: activeTab === 'events' ? '#7e22ce' : 'white',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    marginLeft: 'auto'
                                }}>
                                    {events.length}
                                </span>
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
                        <li style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('audit')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: activeTab === 'audit' ? 'linear-gradient(135deg, #1e3c72, #7e22ce)' : 'transparent',
                                    color: activeTab === 'audit' ? 'white' : '#4b5563',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                🔍 Audit Logs
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
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>System Overview</h2>
                            
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
                                        Total Users
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {users.length}
                                    </div>
                                    <div style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        ↑ 5 new this month
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
                                        {stats.total_events || events.length}
                                    </div>
                                    <div style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        📅 {stats.upcoming_events || 0} upcoming
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
                                    <div style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        ✅ {registrations.filter(r => r.attendance_marked).length} attended
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        Categories
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e3c72' }}>
                                        {categories.length}
                                    </div>
                                    <div style={{ color: '#7e22ce', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        🏷️ {categories.map(c => c.name).join(', ')}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <h3 style={{ color: '#1e3c72', marginBottom: '1rem' }}>Recent Activity</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Time</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>User</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Action</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.slice(0, 5).map(log => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{ fontWeight: '600' }}>{log.email}</span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            background: log.action === 'CREATE' ? '#10b981' :
                                                                       log.action === 'UPDATE' ? '#f59e0b' :
                                                                       log.action === 'DELETE' ? '#ef4444' :
                                                                       '#7e22ce',
                                                            color: 'white',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>{log.details}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: '#1e3c72' }}>User Management</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        style={{
                                            padding: '0.5rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            width: '250px'
                                        }}
                                    />
                                </div>
                            </div>

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
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>ID</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Name</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Email</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Role</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Joined</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem' }}>#{user.id}</td>
                                                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                                                        {user.first_name} {user.last_name}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>{user.email}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            background: user.role === 'admin' ? '#ef4444' :
                                                                       user.role === 'staff' ? '#7e22ce' : '#10b981',
                                                            color: 'white',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            color: user.is_active ? '#10b981' : '#ef4444',
                                                            fontWeight: '600'
                                                        }}>
                                                            {user.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setShowUserModal(true);
                                                                }}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: '#7e22ce',
                                                                    cursor: 'pointer',
                                                                    padding: '0.25rem 0.5rem'
                                                                }}
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            {user.id !== 1 && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#ef4444',
                                                                        cursor: 'pointer',
                                                                        padding: '0.25rem 0.5rem'
                                                                    }}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            )}
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

                    {activeTab === 'events' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: '#1e3c72' }}>Event Management</h2>
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
                                        setShowEventModal(true);
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
                                        gap: '0.5rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    ➕ Create New Event
                                </button>
                            </div>

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
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Capacity</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registered</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map(event => (
                                                <tr key={event.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{event.id}</td>
                                                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{event.title}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(event.date).toLocaleDateString()}
                                                        <br/>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{event.time}</span>
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
                                                    <td style={{ padding: '0.75rem' }}>{event.capacity}</td>
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
                                                                    setShowEventModal(true);
                                                                }}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: '#7e22ce',
                                                                    cursor: 'pointer',
                                                                    padding: '0.25rem 0.5rem'
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
                                                                    cursor: 'pointer',
                                                                    padding: '0.25rem 0.5rem'
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

                    {activeTab === 'registrations' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>All Registrations</h2>
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
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>User</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Event</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Registered</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Status</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Attendance</th>
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
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(reg.event_date).toLocaleDateString()}</div>
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
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await apiService.markAttendance(reg.id);
                                                                        alert('Attendance marked successfully');
                                                                        fetchAllData();
                                                                    } catch (error) {
                                                                        alert('Error marking attendance: ' + error.message);
                                                                    }
                                                                }}
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

                    {activeTab === 'audit' && (
                        <div>
                            <h2 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>Audit Logs</h2>
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
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Timestamp</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>User</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Action</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Entity</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>Details</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6b7280' }}>IP Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map(log => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{ fontWeight: '600' }}>{log.email}</span>
                                                        <br/>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{log.first_name} {log.last_name}</span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            background: log.action === 'CREATE' ? '#10b981' :
                                                                       log.action === 'UPDATE' ? '#f59e0b' :
                                                                       log.action === 'DELETE' ? '#ef4444' :
                                                                       log.action === 'LOGIN' ? '#7e22ce' : '#1e3c72',
                                                            color: 'white',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {log.entity_type}: {log.entity_id}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>{log.details}</td>
                                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{log.ip_address}</td>
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

            {/* User Edit Modal */}
            {showUserModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>
                            Edit User - {selectedUser.first_name} {selectedUser.last_name}
                        </h3>
                        
                        <form onSubmit={handleUpdateUser}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedUser.first_name || ''}
                                    onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
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
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedUser.last_name || ''}
                                    onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
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
                                    Role
                                </label>
                                <select
                                    value={selectedUser.role || 'student'}
                                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem'
                                    }}
                                >
                                    <option value="student">Student</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                    Status
                                </label>
                                <select
                                    value={selectedUser.is_active ? 'active' : 'inactive'}
                                    onChange={(e) => setSelectedUser({...selectedUser, is_active: e.target.value === 'active' ? 1 : 0})}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem'
                                    }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
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
                                    Update User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
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

            {/* Event Create/Edit Modal */}
            {showEventModal && selectedEvent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ color: '#1e3c72', marginBottom: '1.5rem' }}>
                            {selectedEvent.id ? 'Edit Event' : 'Create New Event'}
                        </h3>
                        
                        <form onSubmit={selectedEvent.id ? handleUpdateEvent : async (e) => {
                            e.preventDefault();
                            try {
                                await apiService.createEvent(selectedEvent);
                                alert('Event created successfully');
                                setShowEventModal(false);
                                fetchAllData();
                            } catch (error) {
                                alert('Error creating event: ' + error.message);
                            }
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563' }}>
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    value={selectedEvent.title || ''}
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
                                    value={selectedEvent.description || ''}
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
                                        value={selectedEvent.date || ''}
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
                                        value={selectedEvent.time || ''}
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
                                        value={selectedEvent.venue || ''}
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
                                        value={selectedEvent.category || ''}
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
                                        value={selectedEvent.capacity || 100}
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
                                        value={selectedEvent.organizer || ''}
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
                                    value={selectedEvent.image_url || ''}
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
                                    {selectedEvent.id ? 'Update Event' : 'Create Event'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEventModal(false)}
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
        </div>
    );
}
