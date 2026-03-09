import React from 'react';

const HomePage = ({ events = [], stats = {}, onViewEvent, onRegister, user }) => {
    const featuredEvents = events.slice(0, 3);

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>KCA University</h1>
                <p style={styles.heroMotto}>"Advancing Knowledge, Driving Change"</p>
                <h2 style={styles.heroSubtitle}>Event Management System</h2>
                <p style={styles.heroText}>
                    Discover and register for university events seamlessly.
                </p>
            </div>

            {/* Stats Section */}
            <div style={styles.statsGrid}>
                <StatCard number={stats.total_events || 45} label="Total Events" />
                <StatCard number={stats.upcoming_events || 12} label="Upcoming Events" />
                <StatCard number={stats.total_registered || 1248} label="Registrations" />
                <StatCard number="8" label="Active Venues" />
            </div>

            {/* Featured Events */}
            <h2 style={styles.sectionTitle}>Featured Events</h2>
            <div style={styles.eventsGrid}>
                {featuredEvents.map(event => (
                    <EventCard 
                        key={event.id}
                        event={event}
                        onView={() => onViewEvent(event)}
                        onRegister={() => onRegister(event.id)}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ number, label }) => (
    <div style={statStyles.card}>
        <div style={statStyles.number}>{number}</div>
        <div style={statStyles.label}>{label}</div>
    </div>
);

const EventCard = ({ event, onView, onRegister, user }) => {
    const spotsLeft = event.capacity - event.registered;
    const isFull = spotsLeft <= 0;

    return (
        <div style={cardStyles.card}>
            <div style={cardStyles.image}>
                {event.category === 'Career' ? '💼' : 
                 event.category === 'Sports' ? '🏆' : 
                 event.category === 'Technology' ? '💻' : '🎓'}
            </div>
            <div style={cardStyles.content}>
                <span style={cardStyles.category}>{event.category}</span>
                <h3 style={cardStyles.title}>{event.title}</h3>
                <p style={cardStyles.meta}>
                    📅 {event.date} | 📍 {event.venue}
                </p>
                <p style={cardStyles.capacity}>
                    👥 {event.registered}/{event.capacity} registered
                    {isFull && <span style={cardStyles.full}>(Full)</span>}
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
        margin: '0 auto'
    },
    hero: {
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '2rem'
    },
    heroTitle: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        color: 'white'
    },
    heroMotto: {
        fontSize: '1.2rem',
        color: '#eab308',
        marginBottom: '1rem',
        fontStyle: 'italic'
    },
    heroSubtitle: {
        fontSize: '1.8rem',
        marginBottom: '1rem',
        color: 'white'
    },
    heroText: {
        fontSize: '1.1rem',
        opacity: 0.9
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
    },
    sectionTitle: {
        color: '#1e3c72',
        marginBottom: '1.5rem',
        fontSize: '1.8rem'
    },
    eventsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
    }
};

const statStyles = {
    card: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    number: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1e3c72'
    },
    label: {
        color: '#666'
    }
};

const cardStyles = {
    card: {
        background: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
        padding: '1.5rem'
    },
    category: {
        background: '#eab308',
        color: '#1e3c72',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '0.5rem'
    },
    title: {
        margin: '0.5rem 0',
        color: '#1e3c72',
        fontSize: '1.2rem'
    },
    meta: {
        color: '#666',
        fontSize: '0.9rem',
        margin: '0.5rem 0'
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

export default HomePage;
