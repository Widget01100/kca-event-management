import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/Dashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Calendar from './pages/Calendar';

// Auth Service
import authService from './services/auth';

function App() {
    const currentUser = authService.getCurrentUser();

    return (
        <BrowserRouter>
            <div className="App">
                {/* Global Navigation */}
                <nav className="kca-nav">
                    <div className="kca-nav-container">
                        <Link to="/" className="kca-nav-logo">
                            KCA University
                        </Link>
                        <ul className="kca-nav-menu">
                            <li><Link to="/" className="kca-nav-link">Home</Link></li>
                            <li><Link to="/events" className="kca-nav-link">Events</Link></li>
                            <li><Link to="/calendar" className="kca-nav-link">Calendar</Link></li>
                            <li><Link to="/contact" className="kca-nav-link">Contact</Link></li>
                            {currentUser ? (
                                <>
                                    <li>
                                        <Link
                                            to={
                                                currentUser.role === 'admin' ? '/admin/dashboard' :
                                                currentUser.role === 'staff' ? '/staff/dashboard' :
                                                '/dashboard'
                                            }
                                            className="kca-nav-link"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => authService.logout()}
                                            className="btn btn-sm btn-outline"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="btn btn-sm btn-outline">Login</Link></li>
                                    <li><Link to="/signup" className="btn btn-sm btn-primary">Sign Up</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>

                {/* Page Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/staff/dashboard" element={<StaffDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/contact" element={
                        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                            <h1 style={{ color: '#1e3c72' }}>Contact Us</h1>
                            <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'left' }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <strong>📧 Email:</strong> events@kca.ac.ke
                                </div>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <strong>📞 Phone:</strong> +254 123 456 789
                                </div>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <strong>📍 Address:</strong> KCA University, Nairobi, Kenya
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <strong>⏰ Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
                                </div>
                            </div>
                        </div>
                    } />
                </Routes>

                {/* Global Footer */}
                <footer className="kca-footer">
                    <div className="container">
                        <div className="footer-content">
                            <div>
                                <h4 className="footer-title">KCA University</h4>
                                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
                                    "Advancing Knowledge, Driving Change"
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                                    © 2026 KCA University Event Management System<br />
                                    Version 2.0 - Complete Full-Stack Solution
                                </p>
                            </div>
                            <div>
                                <h4 className="footer-title">Quick Links</h4>
                                <ul className="footer-links">
                                    <li className="footer-link"><Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link></li>
                                    <li className="footer-link"><Link to="/events" style={{ color: 'rgba(255,255,255,0.8)' }}>Events</Link></li>
                                    <li className="footer-link"><Link to="/calendar" style={{ color: 'rgba(255,255,255,0.8)' }}>Calendar</Link></li>
                                    <li className="footer-link"><Link to="/contact" style={{ color: 'rgba(255,255,255,0.8)' }}>Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="footer-title">Contact Us</h4>
                                <ul className="footer-links">
                                    <li className="footer-link" style={{ color: 'rgba(255,255,255,0.8)' }}>📧 events@kca.ac.ke</li>
                                    <li className="footer-link" style={{ color: 'rgba(255,255,255,0.8)' }}>📞 +254 123 456 789</li>
                                    <li className="footer-link" style={{ color: 'rgba(255,255,255,0.8)' }}>📍 Nairobi, Kenya</li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>Made with 🎓 for KCA University | "Advancing Knowledge, Driving Change"</p>
                        </div>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
