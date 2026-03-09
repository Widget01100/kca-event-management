import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EventsPage = ({ events: propEvents, onViewEvent, onRegister, user }) => {
    const [events, setEvents] = useState(propEvents || []);
    const [loading, setLoading] = useState(!propEvents);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        // If events weren't passed as props, fetch them
        if (!propEvents) {
            fetchEvents();
        }
    }, [propEvents]);

    useEffect(() => {
        // Update events when props change
        if (propEvents) {
            setEvents(propEvents);
            setLoading(false);
        }
    }, [propEvents]);

    const fetchEvents = async () => {
        try {
            const data = await api.getEvents();
            setEvents(data.data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories from events
    const categories = ['All', ...new Set(events.map(e => e.category).filter(Boolean))];

    // Filter events based on search and category
    const filteredEvents = events.filter(event => {
        const matchesSearch = search === '' || 
            (event.title && event.title.toLowerCase().includes(search.toLowerCase())) ||
            (event.description && event.description.toLowerCase().includes(search.toLowerCase()));
        
        const matchesCategory = category === 'All' || event.category === category;
        
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div style={styles.loading}>
                <h2>Loading events...</h2>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>University Events</h1>
            <p style={styles.subtitle}>Discover and join upcoming events at KCA University</p>

            <div style={styles.filters}>
                <input
                    type="text"
                    placeholder="Search events..."
                    style={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    style={styles.categorySelect}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <p style={styles.resultCount}>
                Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </p>

            {filteredEvents.length === 0 ? (
                <div style={styles.noResults}>
                    <div style={styles.noResultsIcon}>🔍</div>
                    <h3 style={styles.noResultsTitle}>No events found</h3>
                    <p style={styles.noResultsText}>Try adjusting your search or filter</p>
                    {events.length === 0 && (
                        <p style={styles.noEventsMessage}>
                            There are no events in the system yet. 
                            {user?.role === 'staff' || user?.role === 'admin' ? 
                                ' You can create one from your dashboard.' : 
                                ' Please check back later.'}
                        </p>
                    )}
                </div>
            ) : (
                <div style={styles.eventsGrid}>
                    {filteredEvents.map(event => (
                        <EventCard 
                            key={event.id}
                            event={event}
                            onView={() => onViewEvent(event)}
                            onRegister={() => onRegister(event.id)}
                            user={user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const EventCard = ({ event, onView, onRegister, user }) => {
    const spotsLeft = event.capacity - event.registered;
    const isFull = spotsLeft <= 0;

    return (
        <div style={cardStyles.card}>
            <div style={cardStyles.image}>
                {event.category === 'Career' ? '💼' : 
                 event.category === 'Sports' ? '🏆' : 
                 event.category === 'Technology' ? '💻' : 
                 event.category === 'Academic' ? '📚' : '🎓'}
            </div>
            <div style={cardStyles.content}>
                <span style={cardStyles.category}>{event.category || 'General'}</span>
                <h3 style={cardStyles.title}>{event.title}</h3>
                <p style={cardStyles.meta}>
                    📅 {event.date || 'TBD'} | 📍 {event.venue || 'TBD'}
                </p>
                <p style={cardStyles.description}>
                    {event.description ? event.description.substring(0, 100) : 'No description available'}...
                </p>
                <p style={cardStyles.capacity}>
                    👥 {event.registered || 0}/{event.capacity || 0} registered
                    {isFull && <span style={cardStyles.full}> (Full)</span>}
                </p>
                <div style={cardStyles.buttons}>
                    <button style={cardStyles.viewButton} onClick={onView}>
                        View Details
                    </button>
                    {user && user.role === 'student' && !isFull && (
                        <button style={cardStyles.registerButton} onClick={onRegister}>
                            Register
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 0'
    },
    title: {
        color: '#1e3c72',
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
    },
    subtitle: {
        color: '#666',
        fontSize: '1.2rem',
        marginBottom: '2rem'
    },
    loading: {
        textAlign: 'center',
        padding: '4rem',
        color: '#1e3c72'
    },
    filters: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
    },
    searchInput: {
        flex: 1,
        minWidth: '250px',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem'
    },
    categorySelect: {
        padding: '0.75rem 2rem 0.75rem 0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
        background: 'white'
    },
    resultCount: {
        color: '#666',
        marginBottom: '1.5rem'
    },
    eventsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
    },
    noResults: {
        textAlign: 'center',
        padding: '4rem',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    noResultsIcon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    noResultsTitle: {
        color: '#1e3c72',
        marginBottom: '0.5rem'
    },
    noResultsText: {
        color: '#666',
        marginBottom: '1rem'
    },
    noEventsMessage: {
        color: '#7e22ce',
        marginTop: '1rem',
        padding: '1rem',
        background: '#f3e8ff',
        borderRadius: '5px'
    }
};

const cardStyles = {
    card: {
        background: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    image: {
        height: '150px',
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '3rem'
    },
    content: {
        padding: '1.5rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    category: {
        background: '#eab308',
        color: '#1e3c72',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '0.5rem',
        alignSelf: 'flex-start'
    },
    title: {
        margin: '0.5rem 0',
        color: '#1e3c72',
        fontSize: '1.2rem'
    },
    meta: {
        color: '#666',
        fontSize: '0.9rem',
        margin: '0.5rem 0',
        lineHeight: '1.6'
    },
    description: {
        color: '#666',
        fontSize: '0.9rem',
        margin: '0.5rem 0',
        flex: 1
    },
    capacity: {
        color: '#666',
        fontSize: '0.9rem',
        margin: '0.5rem 0'
    },
    full: {
        color: '#c62828',
        marginLeft: '0.5rem'
    },
    buttons: {
        display: 'flex',
        gap: '0.5rem',
        marginTop: '1rem'
    },
    viewButton: {
        flex: 1,
        padding: '0.5rem',
        background: '#7e22ce',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    registerButton: {
        flex: 1,
        padding: '0.5rem',
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default EventsPage;
