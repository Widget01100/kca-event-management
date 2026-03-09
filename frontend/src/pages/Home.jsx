import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, statsRes] = await Promise.all([
          axios.get('/api/events'),
          axios.get('/api/stats')
        ]);
        setEvents(eventsRes.data.data || []);
        setStats(statsRes.data.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use mock data if API fails
        setEvents([
          {
            id: "KCA-CF-2024-001",
            title: "Annual Career Fair 2025",
            description: "Connect with top employers and explore career opportunities.",
            date: "2025-03-15",
            venue: "Main Auditorium",
            category: "Career",
            capacity: 500,
            registered: 342
          },
          {
            id: "KCA-TS-2024-001",
            title: "Tech Innovation Summit",
            description: "Explore the latest in technology and innovation.",
            date: "2025-03-22",
            venue: "Tech Hub",
            category: "Technology",
            capacity: 200,
            registered: 189
          },
          {
            id: "KCA-SD-2024-001",
            title: "Sports Championship",
            description: "Annual inter-faculty sports competition.",
            date: "2025-03-30",
            venue: "University Stadium",
            category: "Sports",
            capacity: 1000,
            registered: 678
          }
        ]);
        setStats({
          total_events: 45,
          upcoming_events: 12,
          total_registered: 1248
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {/* Navigation is now in App.jsx */}
      
      {/* KCA Header */}
      <header className="kca-header">
        <div className="container">
          <div className="kca-header-content fade-in">
            <h1 className="kca-logo">KCA University</h1>
            <p className="kca-motto">"Advancing Knowledge, Driving Change"</p>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>
              Event Management System
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.25rem' }}>
              Discover and register for university events seamlessly. 
              Empowering students with opportunities for growth and connection.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/events" className="btn btn-lg btn-gold">Explore Events</Link>
              <Link to="/calendar" className="btn btn-lg btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                View Calendar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* University at a Glance */}
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card fade-in">
            <div className="stat-icon">📊</div>
            <div className="stat-number">{stats.total_events || 45}</div>
            <div className="stat-label">Total Events</div>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.upcoming_events || 12}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.total_registered || 1248}</div>
            <div className="stat-label">Registrations</div>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon">📍</div>
            <div className="stat-number">8</div>
            <div className="stat-label">Active Venues</div>
          </div>
        </div>

        {/* Featured Events */}
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Featured Events
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {events.slice(0, 3).map((event, index) => (
            <div key={event.id} className="event-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="event-image" style={{
                background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                {event.category === 'Career' ? '💼' : event.category === 'Sports' ? '🏆' : '💻'}
              </div>
              <div className="event-content">
                <span className="event-category">{event.category}</span>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                  <span>📅 {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                  <span>📍 {event.venue}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-stats">
                  <div className="event-capacity">
                    <span style={{ color: '#6b7280' }}>Registered:</span>
                    <strong style={{ color: '#1e3c72' }}>{event.registered}/{event.capacity}</strong>
                  </div>
                  <Link to={`/event/${event.id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Link to="/events" className="btn btn-lg btn-primary">View All Events</Link>
        </div>
      </div>
    </div>
  );
}
