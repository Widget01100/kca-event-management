import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AttendanceManager from '../components/AttendanceManager';

const StaffDashboard = ({ user, events, onEventUpdate }) => {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [allRegistrations, setAllRegistrations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAttendance, setShowAttendance] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category_id: '',
        capacity: 100,
        organizer: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        image_url: ''
    });
    const [activeTab, setActiveTab] = useState('myevents');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, events]);

    const fetchData = async () => {
        try {
            // Filter events created by this staff member
            const staffEvents = events.filter(e => e.created_by === user?.id);
            setMyEvents(staffEvents);

            // Get all registrations (staff can view all)
            const regData = await api.getAllRegistrations();
            setAllRegistrations(regData.data || []);

            // Get categories
            const catData = await api.getCategories();
            setCategories(catData.data || []);

            // Get stats
            const statsData = await api.getStats();
            setStats(statsData.data || {});
        } catch (error) {
            console.error('Error fetching staff data:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.createEvent(formData);
            alert('✅ Event created successfully!');
            setShowCreateForm(false);
            onEventUpdate();
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                venue: '',
                category_id: '',
                capacity: 100,
                organizer: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                image_url: ''
            });
        } catch (error) {
            alert('❌ Error creating event: ' + error.message);
        }
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            venue: event.venue,
            category_id: event.category_id,
            capacity: event.capacity,
            organizer: event.organizer,
            image_url: event.image_url || ''
        });
        setShowCreateForm(true);
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.updateEvent(selectedEvent.id, formData);
            alert('✅ Event updated successfully!');
            setShowCreateForm(false);
            setSelectedEvent(null);
            onEventUpdate();
        } catch (error) {
            alert('❌ Error updating event: ' + error.message);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }
        try {
            await api.deleteEvent(eventId);
            alert('✅ Event deleted successfully!');
            onEventUpdate();
        } catch (error) {
            alert('❌ Error deleting event: ' + error.message);
        }
    };

    const handleMarkAttendance = async (registrationId) => {
        try {
            await api.markAttendance(registrationId);
            alert('✅ Attendance marked successfully!');
            fetchData();
        } catch (error) {
            alert('❌ Error marking attendance: ' + error.message);
        }
    };

    // Get registrations for a specific event
    const getEventRegistrations = (eventId) => {
        return allRegistrations.filter(r => r.event_id === eventId);
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.welcome}>Staff Dashboard</h1>
                <p style={styles.subtitle}>Welcome, {user?.firstName} {user?.lastName}</p>
                <div style={styles.stats}>
                    <StatCard number={myEvents.length} label="My Events" />
                    <StatCard number={allRegistrations.length} label="Total Registrations" />
                    <StatCard number={stats.upcoming_events || 0} label="Upcoming Events" />
                </div>
            </div>

            {/* Action Button */}
            <div style={styles.actions}>
                <button style={styles.createButton} onClick={() => {
                    setSelectedEvent(null);
                    setFormData({
                        title: '',
                        description: '',
                        date: '',
                        time: '',
                        venue: '',
                        category_id: '',
                        capacity: 100,
                        organizer: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                        image_url: ''
                    });
                    setShowCreateForm(true);
                }}>
                    ➕ Create New Event
                </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <TabButton 
                    active={activeTab === 'myevents'} 
                    onClick={() => setActiveTab('myevents')}
                    label={`My Events (${myEvents.length})`}
                />
                <TabButton 
                    active={activeTab === 'registrations'} 
                    onClick={() => setActiveTab('registrations')}
                    label={`All Registrations (${allRegistrations.length})`}
                />
                <TabButton 
                    active={activeTab === 'attendance'} 
                    onClick={() => setActiveTab('attendance')}
                    label="Mark Attendance"
                />
            </div>

            {/* Content */}
            <div style={styles.content}>
                {/* My Events Tab */}
                {activeTab === 'myevents' && (
                    <div>
                        <h3 style={styles.sectionTitle}>Events I've Created</h3>
                        {myEvents.length === 0 ? (
                            <p style={styles.emptyText}>You haven't created any events yet.</p>
                        ) : (
                            <div style={styles.eventList}>
                                {myEvents.map(event => (
                                    <div key={event.id} style={styles.eventCard}>
                                        <div style={styles.eventInfo}>
                                            <h4 style={styles.eventTitle}>{event.title}</h4>
                                            <p style={styles.eventMeta}>
                                                📅 {event.date} | ⏰ {event.time}<br />
                                                📍 {event.venue} | 🏷️ {event.category_name}
                                            </p>
                                            <p style={styles.eventStats}>
                                                👥 Registered: {event.registered}/{event.capacity}
                                            </p>
                                        </div>
                                        <div style={styles.eventActions}>
                                            <button 
                                                style={styles.editButton}
                                                onClick={() => handleEditEvent(event)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                            <button 
                                                style={styles.attendanceButton}
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setActiveTab('attendance');
                                                }}
                                            >
                                                📋 Attendance
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Registrations Tab */}
                {activeTab === 'registrations' && (
                    <div>
                        <h3 style={styles.sectionTitle}>All Event Registrations</h3>
                        {allRegistrations.length === 0 ? (
                            <p style={styles.emptyText}>No registrations yet.</p>
                        ) : (
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Registered On</th>
                                            <th>Status</th>
                                            <th>Attended</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allRegistrations.map(reg => (
                                            <tr key={reg.id}>
                                                <td>{reg.email}</td>
                                                <td>{reg.event_title}</td>
                                                <td>{new Date(reg.event_date).toLocaleDateString()}</td>
                                                <td>{new Date(reg.registered_at).toLocaleDateString()}</td>
                                                <td>
                                                    <span style={reg.status === 'confirmed' ? styles.confirmed : styles.cancelled}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {reg.attendance_marked ? '✅' : '❌'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <div>
                        <h3 style={styles.sectionTitle}>Mark Attendance</h3>
                        {!selectedEvent ? (
                            <div>
                                <p style={styles.selectPrompt}>Select an event to mark attendance:</p>
                                <div style={styles.eventGrid}>
                                    {myEvents.map(event => (
                                        <div 
                                            key={event.id} 
                                            style={styles.eventSelectCard}
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <h4 style={styles.eventTitle}>{event.title}</h4>
                                            <p style={styles.eventMeta}>
                                                📅 {event.date}<br />
                                                📍 {event.venue}
                                            </p>
                                            <p style={styles.eventStats}>
                                                👥 {event.registered} registered
                                            </p>
                                            <button style={styles.selectButton}>
                                                Select Event
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <AttendanceManager 
                                eventId={selectedEvent.id}
                                eventTitle={selectedEvent.title}
                                onClose={() => {
                                    setSelectedEvent(null);
                                    fetchData();
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Create/Edit Event Modal */}
            {showCreateForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>
                            {selectedEvent ? 'Edit Event' : 'Create New Event'}
                        </h3>
                        <form onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Event Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                style={styles.textarea}
                                rows="3"
                                required
                            />
                            <div style={styles.row}>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                                <input
                                    type="text"
                                    name="time"
                                    placeholder="Time (e.g., 09:00 AM)"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.row}>
                                <input
                                    type="text"
                                    name="venue"
                                    placeholder="Venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.row}>
                                <input
                                    type="number"
                                    name="capacity"
                                    placeholder="Capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                                <input
                                    type="text"
                                    name="organizer"
                                    placeholder="Organizer"
                                    value={formData.organizer}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <input
                                type="url"
                                name="image_url"
                                placeholder="Image URL (optional)"
                                value={formData.image_url}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            <div style={styles.buttonRow}>
                                <button type="submit" style={styles.submitButton}>
                                    {selectedEvent ? 'Update Event' : 'Create Event'}
                                </button>
                                <button 
                                    type="button" 
                                    style={styles.cancelButton}
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setSelectedEvent(null);
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
};

// Helper Components
const StatCard = ({ number, label }) => (
    <div style={statStyles.card}>
        <div style={statStyles.number}>{number}</div>
        <div style={statStyles.label}>{label}</div>
    </div>
);

const TabButton = ({ active, onClick, label }) => (
    <button
        style={active ? tabStyles.active : tabStyles.inactive}
        onClick={onClick}
    >
        {label}
    </button>
);

// Styles
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
        opacity: 0.9,
        marginBottom: '1.5rem'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
    },
    actions: {
        marginBottom: '2rem'
    },
    createButton: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    tabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
    },
    content: {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        color: '#1e3c72',
        marginBottom: '1.5rem'
    },
    emptyText: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666'
    },
    eventList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    eventCard: {
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    eventInfo: {
        flex: 1
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
    eventStats: {
        color: '#666',
        fontSize: '0.9rem'
    },
    eventActions: {
        display: 'flex',
        gap: '0.5rem'
    },
    editButton: {
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    deleteButton: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    attendanceButton: {
        background: '#7e22ce',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem'
    },
    confirmed: {
        color: '#10b981',
        fontWeight: 'bold'
    },
    cancelled: {
        color: '#dc3545',
        fontWeight: 'bold'
    },
    selectPrompt: {
        marginBottom: '1rem',
        color: '#666'
    },
    eventGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
    },
    eventSelectCard: {
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        ':hover': {
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderColor: '#7e22ce'
        }
    },
    selectButton: {
        width: '100%',
        marginTop: '0.5rem',
        padding: '0.5rem',
        background: '#7e22ce',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    modal: {
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
    },
    modalContent: {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    modalTitle: {
        color: '#1e3c72',
        marginBottom: '1.5rem'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem'
    },
    textarea: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
        fontFamily: 'inherit'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    },
    buttonRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginTop: '1rem'
    },
    submitButton: {
        padding: '0.75rem',
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem'
    },
    cancelButton: {
        padding: '0.75rem',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem'
    }
};

const statStyles = {
    card: {
        background: 'rgba(255,255,255,0.2)',
        padding: '1rem',
        borderRadius: '5px',
        textAlign: 'center'
    },
    number: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white'
    },
    label: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.9)'
    }
};

const tabStyles = {
    active: {
        padding: '0.75rem 1.5rem',
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    inactive: {
        padding: '0.75rem 1.5rem',
        background: '#e9ecef',
        color: '#495057',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default StaffDashboard;
