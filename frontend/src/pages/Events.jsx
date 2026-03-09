import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data.data || []);
        setFilteredEvents(res.data.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Mock data
        const mockEvents = [
          {
            id: "KCA-CF-2024-001",
            title: "Annual Career Fair 2025",
            description: "Connect with top employers and explore career opportunities. Features resume reviews, mock interviews, and networking sessions.",
            date: "2025-03-15",
            time: "09:00 AM - 05:00 PM",
            venue: "Main Auditorium",
            category: "Career",
            capacity: 500,
            registered: 342,
            organizer: "KCA Career Services"
          },
          {
            id: "KCA-TS-2024-001",
            title: "Tech Innovation Summit",
            description: "Explore the latest in technology, AI, and digital transformation. Featuring guest speakers from the tech industry.",
            date: "2025-03-22",
            time: "02:00 PM - 05:00 PM",
            venue: "Tech Hub",
            category: "Technology",
            capacity: 200,
            registered: 189,
            organizer: "KCA Computer Science Dept"
          },
          {
            id: "KCA-SD-2024-001",
            title: "Sports Championship",
            description: "Annual inter-faculty sports competition featuring football, basketball, athletics, and more.",
            date: "2025-03-30",
            time: "08:00 AM - 06:00 PM",
            venue: "University Stadium",
            category: "Sports",
            capacity: 1000,
            registered: 678,
            organizer: "KCA Sports Department"
          },
          {
            id: "KCA-WS-2024-001",
            title: "Research Symposium",
            description: "Showcase of student and faculty research projects across all departments.",
            date: "2025-04-05",
            time: "10:00 AM - 04:00 PM",
            venue: "Library Hall",
            category: "Academic",
            capacity: 300,
            registered: 156,
            organizer: "KCA Research Office"
          },
          {
            id: "KCA-AL-2024-001",
            title: "Alumni Networking Night",
            description: "Connect with successful KCA alumni working in various industries.",
            date: "2025-04-12",
            time: "06:00 PM - 09:00 PM",
            venue: "Alumni Center",
            category: "Networking",
            capacity: 150,
            registered: 98,
            organizer: "KCA Alumni Relations"
          }
        ];
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(events.map(e => e.category))];

  // Filter events based on search and category
  useEffect(() => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1e3c72', marginBottom: '0.5rem' }}>
        University Events
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1.25rem', marginBottom: '2rem' }}>
        Discover and join upcoming events at KCA University
      </p>

      {/* Search and Filter Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            minWidth: '250px'
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.75rem 2rem 0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
        Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
      </p>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#1e3c72' }}>Loading events...</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: '#f9fafb',
          borderRadius: '1rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#1e3c72', marginBottom: '0.5rem' }}>No events found</h3>
          <p style={{ color: '#6b7280' }}>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image" style={{
                background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                {event.category === 'Career' ? '💼' : 
                 event.category === 'Sports' ? '🏆' : 
                 event.category === 'Technology' ? '💻' :
                 event.category === 'Academic' ? '📚' : '🤝'}
              </div>
              <div className="event-content">
                <span className="event-category">{event.category}</span>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                  <span>📅 {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                  <span>⏰ {event.time}</span>
                  <span>📍 {event.venue}</span>
                </div>
                <p className="event-description">{event.description.substring(0, 120)}...</p>
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
      )}
    </div>
  );
}
