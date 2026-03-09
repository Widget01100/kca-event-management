import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data.data || []);
      } catch (error) {
        // Mock events
        setEvents([
          {
            id: "KCA-CF-2024-001",
            title: "Annual Career Fair 2025",
            date: "2025-03-15",
            category: "Career"
          },
          {
            id: "KCA-TS-2024-001",
            title: "Tech Innovation Summit",
            date: "2025-03-22",
            category: "Technology"
          },
          {
            id: "KCA-SD-2024-001",
            title: "Sports Championship",
            date: "2025-03-30",
            category: "Sports"
          }
        ]);
      }
    };
    fetchEvents();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day) => {
    const date = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === date);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1e3c72' }}>Event Calendar</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={prevMonth} className="btn btn-outline">← Previous</button>
          <h2 style={{ fontSize: '1.5rem', color: '#7e22ce', minWidth: '200px', textAlign: 'center' }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="btn btn-outline">Next →</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header" style={{
            padding: '1rem',
            background: '#f9fafb',
            textAlign: 'center',
            fontWeight: '600',
            color: '#1e3c72',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {day}
          </div>
        ))}

        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="calendar-day" style={{
            background: '#f9fafb',
            minHeight: '120px'
          }}></div>
        ))}

        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          return (
            <div key={day} className="calendar-day" style={{
              background: 'white',
              minHeight: '120px',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              position: 'relative'
            }}>
              <div style={{
                fontWeight: '600',
                color: dayEvents.length > 0 ? '#7e22ce' : '#1e3c72',
                marginBottom: '0.5rem'
              }}>
                {day}
              </div>
              {dayEvents.map(event => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="calendar-event"
                  style={{
                    display: 'block',
                    padding: '0.25rem 0.5rem',
                    marginBottom: '0.25rem',
                    background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {event.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
