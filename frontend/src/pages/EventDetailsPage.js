import React from 'react';

const EventDetailsPage = ({ event, onBack, onRegister, user }) => {
    if (!event) return null;

    const spotsLeft = event.capacity - event.registered;
    const isFull = spotsLeft <= 0;

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={onBack}>
                ← Back to Events
            </button>

            <div style={styles.card}>
                <div style={styles.imageSection}>
                    <div style={styles.image}>
                        {event.category === 'Career' ? '💼' : 
                         event.category === 'Sports' ? '🏆' : 
                         event.category === 'Technology' ? '💻' : 
                         event.category === 'Academic' ? '📚' : '🎓'}
                    </div>
                </div>

                <div style={styles.detailsSection}>
                    <span style={styles.category}>{event.category}</span>
                    <h1 style={styles.title}>{event.title}</h1>

                    <div style={styles.infoGrid}>
                        <InfoItem label="Date" value={event.date} />
                        <InfoItem label="Time" value={event.time} />
                        <InfoItem label="Venue" value={event.venue} />
                        <InfoItem label="Organizer" value={event.organizer} />
                    </div>

                    <div style={styles.description}>
                        <h3 style={styles.sectionTitle}>About This Event</h3>
                        <p style={styles.descriptionText}>{event.description}</p>
                    </div>

                    <div style={isFull ? styles.fullStatus : styles.availableStatus}>
                        <div style={styles.statusRow}>
                            <div>
                                <div style={styles.statusLabel}>Registration Status</div>
                                <div style={styles.statusNumbers}>
                                    {event.registered} / {event.capacity}
                                </div>
                            </div>
                            <div>
                                <div style={styles.statusLabel}>Available Spots</div>
                                <div style={styles.statusNumbers}>{spotsLeft}</div>
                            </div>
                        </div>
                        <div style={styles.progressBar}>
                            <div style={{
                                ...styles.progressFill,
                                width: `${(event.registered / event.capacity) * 100}%`
                            }} />
                        </div>
                    </div>

                    {user && user.role === 'student' && !isFull && (
                        <button style={styles.registerButton} onClick={onRegister}>
                            Register for this Event
                        </button>
                    )}
                    {!user && (
                        <p style={styles.loginPrompt}>
                            Please login to register for this event
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={infoStyles.item}>
        <div style={infoStyles.label}>{label}</div>
        <div style={infoStyles.value}>{value}</div>
    </div>
);

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 0'
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#7e22ce',
        fontSize: '1rem',
        cursor: 'pointer',
        marginBottom: '1rem',
        display: 'inline-block'
    },
    card: {
        background: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    },
    imageSection: {
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        fontSize: '6rem',
        color: 'white'
    },
    detailsSection: {
        padding: '2rem'
    },
    category: {
        background: '#eab308',
        color: '#1e3c72',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '1rem'
    },
    title: {
        color: '#1e3c72',
        fontSize: '2rem',
        marginBottom: '1.5rem'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '5px',
        marginBottom: '1.5rem'
    },
    description: {
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        color: '#1e3c72',
        marginBottom: '0.5rem'
    },
    descriptionText: {
        color: '#666',
        lineHeight: '1.6'
    },
    availableStatus: {
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        borderRadius: '5px',
        color: 'white',
        marginBottom: '1.5rem'
    },
    fullStatus: {
        padding: '1.5rem',
        background: '#ffebee',
        borderRadius: '5px',
        color: '#c62828',
        marginBottom: '1.5rem'
    },
    statusRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem'
    },
    statusLabel: {
        fontSize: '0.9rem',
        opacity: 0.9
    },
    statusNumbers: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        background: '#eab308',
        borderRadius: '4px'
    },
    registerButton: {
        width: '100%',
        padding: '1rem',
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1rem',
        cursor: 'pointer'
    },
    loginPrompt: {
        textAlign: 'center',
        color: '#666'
    }
};

const infoStyles = {
    item: {
        padding: '0.5rem'
    },
    label: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.25rem'
    },
    value: {
        color: '#1e3c72',
        fontWeight: '600'
    }
};

export default EventDetailsPage;
