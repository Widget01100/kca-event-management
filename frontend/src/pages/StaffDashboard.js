import React, { useState } from 'react';
import api from '../services/api';

const StaffDashboard = ({ user, events, onEventUpdate }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: 'Career',
        capacity: 100,
        organizer: `${user.firstName} ${user.lastName}`,
        image_url: ''
    });

    const userEvents = events.filter(e => e.created_by === user.id);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createEvent(formData);
            alert('Event created successfully!');
            setShowCreateForm(false);
            onEventUpdate();
        } catch (error) {
            alert(error.message || 'Failed to create event');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.welcome}>Staff Dashboard</h1>
                <p style={styles.subtitle}>Welcome, {user.firstName} {user.lastName}</p>
            </div>

            <div style={styles.actions}>
                <button 
                    style={styles.createButton}
                    onClick={() => setShowCreateForm(true)}
                >
                    + Create New Event
                </button>
            </div>

            {showCreateForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Create New Event</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                name="title"
                                placeholder="Event Title"
                                style={styles.input}
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                style={styles.textarea}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <div style={styles.row}>
                                <input
                                    type="date"
                                    name="date"
                                    style={styles.input}
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="time"
                                    placeholder="Time (e.g., 09:00 AM)"
                                    style={styles.input}
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={styles.row}>
                                <input
                                    name="venue"
                                    placeholder="Venue"
                                    style={styles.input}
                                    value={formData.venue}
                                    onChange={handleChange}
                                    required
                                />
                                <select
                                    name="category"
                                    style={styles.input}
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Career">Career</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Networking">Networking</option>
                                </select>
                            </div>
                            <div style={styles.row}>
                                <input
                                    type="number"
                                    name="capacity"
                                    placeholder="Capacity"
                                    style={styles.input}
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    name="organizer"
                                    placeholder="Organizer"
                                    style={styles.input}
                                    value={formData.organizer}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={styles.buttonRow}>
                                <button type="submit" style={styles.submitButton}>
                                    Create Event
                                </button>
                                <button 
                                    type="button" 
                                    style={styles.cancelButton}
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>My Events</h2>
                {userEvents.length === 0 ? (
                    <p style={styles.emptyText}>You haven't created any events yet.</p>
                ) : (
                    <div style={styles.list}>
                        {userEvents.map(event => (
                            <div key={event.id} style={styles.card}>
                                <h3 style={styles.eventTitle}>{event.title}</h3>
                                <p style={styles.eventMeta}>
                                    📅 {event.date} | 📍 {event.venue}
                                </p>
                                <p style={styles.eventStats}>
                                    Registered: {event.registered}/{event.capacity}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
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
    actions: {
        marginBottom: '2rem'
    },
    createButton: {
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer'
    },
    section: {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
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
        borderRadius: '5px'
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
    emptyText: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666'
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
        minHeight: '100px'
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
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    cancelButton: {
        padding: '0.75rem',
        background: '#ddd',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default StaffDashboard;
