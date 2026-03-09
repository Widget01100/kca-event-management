import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import api from './services/api';
import auth from './services/auth';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            api.setAuthHeaders(currentUser);
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsData, statsData] = await Promise.all([
                api.getEvents(),
                api.getStats()
            ]);
            console.log('Fetched events:', eventsData.data);
            console.log('Fetched stats:', statsData.data);
            setEvents(eventsData.data || []);
            setStats(statsData.data || {});
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (userData) => {
        setUser(userData);
        api.setAuthHeaders(userData);
        fetchData(); // Refresh data after login
        if (userData.role === 'admin') {
            setCurrentPage('admin');
        } else if (userData.role === 'staff') {
            setCurrentPage('staff');
        } else {
            setCurrentPage('dashboard');
        }
    };

    const handleLogout = () => {
        auth.logout();
        setUser(null);
        setCurrentPage('home');
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            setCurrentPage('login');
            return;
        }
        try {
            await api.registerForEvent(eventId);
            alert('Successfully registered!');
            fetchData(); // Refresh events and stats
        } catch (error) {
            alert(error.message || 'Registration failed');
        }
    };

    const renderPage = () => {
        if (loading) {
            return (
                <div style={styles.loading}>
                    <h2>Loading KCA Event System...</h2>
                </div>
            );
        }

        switch(currentPage) {
            case 'home':
                return <HomePage 
                    events={events} 
                    stats={stats}
                    onViewEvent={(event) => { setSelectedEvent(event); setCurrentPage('event'); }}
                    onRegister={handleRegister}
                    user={user}
                />;
            case 'events':
                return <EventsPage 
                    events={events} 
                    onViewEvent={(event) => { setSelectedEvent(event); setCurrentPage('event'); }}
                    onRegister={handleRegister}
                    user={user}
                />;
            case 'event':
                return <EventDetailsPage 
                    event={selectedEvent} 
                    onBack={() => setCurrentPage('events')}
                    onRegister={() => handleRegister(selectedEvent.id)}
                    user={user}
                />;
            case 'login':
                return <LoginPage 
                    onLogin={handleLogin}
                    onSwitch={() => setCurrentPage('signup')}
                />;
            case 'signup':
                return <SignupPage 
                    onSignup={handleLogin}
                    onSwitch={() => setCurrentPage('login')}
                />;
            case 'dashboard':
                return <DashboardPage 
                    user={user} 
                    events={events}
                />;
            case 'staff':
                return <StaffDashboard 
                    user={user} 
                    events={events}
                    onEventUpdate={fetchData}
                />;
            case 'admin':
                return <AdminDashboard 
                    user={user} 
                    events={events}
                    onEventUpdate={fetchData}
                />;
            default:
                return <HomePage 
                    events={events} 
                    stats={stats}
                    onViewEvent={(event) => { setSelectedEvent(event); setCurrentPage('event'); }}
                    onRegister={handleRegister}
                    user={user}
                />;
        }
    };

    return (
        <div style={styles.app}>
            <Navbar 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                user={user}
                onLogout={handleLogout}
            />
            <main style={styles.main}>
                {renderPage()}
            </main>
            <Footer />
        </div>
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
