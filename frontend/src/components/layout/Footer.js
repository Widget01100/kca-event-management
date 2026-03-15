import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h4 className="footer-title">KCA University</h4>
                        <p className="footer-motto">"Advancing Knowledge, Driving Change"</p>
                        <p className="footer-text">
                            © 2026 Francis Tom (23/05349)<br />
                            DIT 503 Project
                        </p>
                    </div>
                    
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li className="footer-link-item">
                                <Link to="/" className="footer-link">Home</Link>
                            </li>
                            <li className="footer-link-item">
                                <Link to="/events" className="footer-link">Events</Link>
                            </li>
                            <li className="footer-link-item">
                                <Link to="/dashboard" className="footer-link">Dashboard</Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4 className="footer-title">Contact</h4>
                        <div className="footer-contact-item">
                            <span className="footer-icon">📧</span>
                            <a href="mailto:events@kca.ac.ke">events@kca.ac.ke</a>
                        </div>
                        <div className="footer-contact-item">
                            <span className="footer-icon">📞</span>
                            <span>+254 123 456 789</span>
                        </div>
                        <div className="footer-contact-item">
                            <span className="footer-icon">📍</span>
                            <span>Nairobi, Kenya</span>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>Made with 🎓 for KCA University | "Advancing Knowledge, Driving Change"</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
