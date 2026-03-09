import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import authService from '../services/auth';

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registered, setRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
        checkRegistration();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const res = await apiService.getEvent(id);
            setEvent(res.data);
        } catch (error) {
            console.error('Error fetching event:', error);
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        const user = authService.getCurrentUser();
        if (!user) return;

        try {
            const registrations = await apiService.getUserRegistrations();
            const isRegistered = registrations.data?.some(r => r.event_id === id);
            const reg = registrations.data?.find(r => r.event_id === id);
            setRegistered(isRegistered);
            if (reg) setRegistrationId(reg.id);
        } catch (error) {
            console.error('Error checking registration:', error);
        }
    };

    const handleRegister = async () => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const result = await apiService.registerForEvent(id);
            setRegistered(true);
            setRegistrationId(result.registration_id);
            // Update event registered count
            setEvent({ ...event, registered: event.registered + 1 });
        } catch (error) {
            alert(error.message || 'Failed to register for event');
        }
    };

    const handleCancelRegistration = async () => {
        if (!window.confirm('Are you sure you want to cancel your registration?')) {
            return;
        }

        try {
            await apiService.cancelRegistration(registrationId);
            setRegistered(false);
            setRegistrationId(null);
            // Update event registered count
            setEvent({ ...event, registered: event.registered - 1 });
        } catch (error) {
            alert(error.message || 'Failed to cancel registration');
        }
    };

    const handleEdit = () => {
        const user = authService.getCurrentUser();
        if (user.role === 'admin' || (user.role === 'staff' && event.created_by === user.id)) {
            // Navigate to edit page or open modal
            navigate(`/staff/dashboard`, { state: { editEvent: event } });
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#1e3c72' }}>Loading event details...</div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{ color: '#1e3c72', marginBottom: '1rem' }}>Event Not Found</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error || 'The event you\'re looking for doesn\'t exist.'}</p>
                <Link to="/events" className="btn btn-primary">Browse Events</Link>
            </div>
        );
    }

    const user = authService.getCurrentUser();
    const canEdit = user && (user.role === 'admin' || (user.role === 'staff' && event.created_by === user.id));
    const spotsLeft = event.capacity - event.registered;
    const isFull = spotsLeft <= 0;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <Link to="/events" style={{ display: 'inline-block', marginBottom: '2rem', color: '#7e22ce' }}>
                ← Back to Events
            </Link>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
            }}>
                {/* Left Column - Image */}
                <div style={{
                    background: `linear-gradient(135deg, #1e3c72, #7e22ce), url(${event.image_url})`,
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'overlay',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '6rem'
                }}>
                    {event.category === 'Career' ? '💼' : 
                     event.category === 'Sports' ? '🏆' : 
                     event.category === 'Technology' ? '💻' : 
                     event.category === 'Academic' ? '📚' :
                     event.category === 'Networking' ? '🤝' : '🎓'}
                </div>

                {/* Right Column - Details */}
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <span className="event-category" style={{ marginBottom: '1rem' }}>
                            {event.category}
                        </span>
                        {canEdit && (
                            <button
                                onClick={handleEdit}
                                style={{
                                    background: 'none',
                                    border: '1px solid #7e22ce',
                                    color: '#7e22ce',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                ✏️ Edit Event
                            </button>
                        )}
                    </div>
                    
                    <h1 style={{ fontSize: '2.5rem', color: '#1e3c72', marginBottom: '1rem' }}>
                        {event.title}
                    </h1>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        background: '#f9fafb',
                        borderRadius: '0.75rem'
                    }}>
                        <div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date</div>
                            <div style={{ fontWeight: '600', color: '#1e3c72' }}>
                                {new Date(event.date).toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Time</div>
                            <div style={{ fontWeight: '600', color: '#1e3c72' }}>{event.time}</div>
                        </div>
                        <div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Venue</div>
                            <div style={{ fontWeight: '600', color: '#1e3c72' }}>{event.venue}</div>
                        </div>
                        <div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Organizer</div>
                            <div style={{ fontWeight: '600', color: '#1e3c72' }}>{event.organizer}</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#1e3c72', marginBottom: '0.75rem' }}>
                        About This Event
                    </h3>
                    <p style={{ color: '#4b5563', lineHeight: '1.7', marginBottom: '2rem' }}>
                        {event.description}
                    </p>

                    <div style={{ 
                        padding: '1.5rem',
                        background: isFull ? '#fef2f2' : 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                        borderRadius: '0.75rem',
                        color: isFull ? '#ef4444' : 'white',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Registration Status</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                    {event.registered} / {event.capacity}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Available Spots</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                    {spotsLeft}
                                </div>
                            </div>
                        </div>
                        <div style={{ 
                            width: '100%', 
                            height: '8px', 
                            background: isFull ? '#fee2e2' : 'rgba(255,255,255,0.3)', 
                            borderRadius: '4px',
                            marginTop: '1rem',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                width: `${(event.registered / event.capacity) * 100}%`, 
                                height: '100%',
                                background: isFull ? '#ef4444' : '#eab308',
                                borderRadius: '4px'
                            }}></div>
                        </div>
                    </div>

                    {user ? (
                        registered ? (
                            <div>
                                <button 
                                    onClick={handleCancelRegistration}
                                    className="btn btn-lg"
                                    style={{ 
                                        width: '100%',
                                        background: 'white',
                                        color: '#ef4444',
                                        border: '2px solid #ef4444',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    ❌ Cancel Registration
                                </button>
                                <p style={{ 
                                    color: '#10b981', 
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>
                                    ✅ You are registered for this event!
                                </p>
                            </div>
                        ) : (
                            <button 
                                onClick={handleRegister}
                                disabled={isFull}
                                className="btn btn-lg btn-primary"
                                style={{ 
                                    width: '100%',
                                    opacity: isFull ? 0.6 : 1,
                                    cursor: isFull ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isFull ? 'Event Full' : 'Register for This Event'}
                            </button>
                        )
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                Please login to register for this event
                            </p>
                            <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                Login to Register
                            </Link>
                        </div>
                    )}

                    {event.created_by && (
                        <p style={{ 
                            marginTop: '1rem', 
                            fontSize: '0.875rem', 
                            color: '#6b7280',
                            textAlign: 'center'
                        }}>
                            Event created by: {event.creator_name || 'KCA University'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
