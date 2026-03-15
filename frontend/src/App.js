import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import api from './services/api';
import auth from './services/auth';

// Import pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProfilePage from './pages/ProfilePage';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function AppContent() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            api.setAuthHeaders(currentUser);
        }
        fetchEvents();
    }, []);

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

    const handleLogin = (userData) => {
        setUser(userData);
        api.setAuthHeaders(userData);
        if (userData.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (userData.role === 'staff') {
            navigate('/staff/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleLogout = () => {
        auth.logout();
        setUser(null);
        navigate('/');
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.registerForEvent(eventId);
            alert('Successfully registered!');
            fetchEvents(); // Refresh events
        } catch (error) {
            alert(error.message || 'Registration failed');
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <h2>Loading KCA Event System...</h2>
            </div>
        );
    }

    return (
        <div style={styles.app}>
            <Navbar user={user} onLogout={handleLogout} />
            <main style={styles.main}>
                <Routes>
                    <Route path="/" element={
                        <HomePage 
                            events={events} 
                            onViewEvent={(event) => navigate(`/event/${event.id}`)}
                            onRegister={handleRegister}
                            user={user}
                        />
                    } />
                    
                    <Route path="/events" element={
                        <EventsPage 
                            events={events} 
                            onViewEvent={(event) => navigate(`/event/${event.id}`)}
                            onRegister={handleRegister}
                            user={user}
                        />
                    } />
                    
                    <Route path="/event/:id" element={
                        <EventDetailsPage 
                            onRegister={handleRegister}
                            user={user}
                        />
                    } />
                    
                    <Route path="/login" element={
                        <LoginPage 
                            onLogin={handleLogin}
                            onSwitch={() => navigate('/signup')}
                        />
                    } />
                    
                    <Route path="/signup" element={
                        <SignupPage 
                            onSignup={handleLogin}
                            onSwitch={() => navigate('/login')}
                        />
                    } />
                    
                    <Route path="/dashboard" element={
                        <DashboardPage user={user} events={events} />
                    } />
                    
                    <Route path="/staff/dashboard" element={
                        <StaffDashboard 
                            user={user} 
                            events={events}
                            onEventUpdate={fetchEvents}
                        />
                    } />
                    
                    <Route path="/admin/dashboard" element={
                        <AdminDashboard 
                            user={user} 
                            events={events}
                            onEventUpdate={fetchEvents}
                        />
                    } />
                    
                    <Route path="/profile" element={
                        <ProfilePage user={user} />
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

const styles = {
    app: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    main: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#f5f5f5'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white'
    }
};

export default App;
