// src/pages/AdminPage.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Navbar from "../components/layout/Navbar";

const AdminPage = () => {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <div className="admin-info">
                        <p>Welcome, <strong>{user?.name}</strong> ({user?.role})</p>
                        <p>Student ID: {user?.studentId}</p>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="admin-grid">
                    <div className="admin-card">
                        <h2>📊 System Overview</h2>
                        <div className="stats">
                            <div className="stat">
                                <h3>Total Users</h3>
                                <p className="number">0</p>
                            </div>
                            <div className="stat">
                                <h3>Total Events</h3>
                                <p className="number">0</p>
                            </div>
                            <div className="stat">
                                <h3>Registrations</h3>
                                <p className="number">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card">
                        <h2>👥 User Management</h2>
                        <p>Manage students, organizers, and administrators</p>
                        <button className="btn btn-primary">Manage Users</button>
                    </div>

                    <div className="admin-card">
                        <h2>🎯 Event Management</h2>
                        <p>Create, edit, and delete events</p>
                        <button className="btn btn-primary">Manage Events</button>
                    </div>

                    <div className="admin-card">
                        <h2>📈 Analytics</h2>
                        <p>View event statistics and reports</p>
                        <button className="btn btn-primary">View Analytics</button>
                    </div>

                    <div className="admin-card">
                        <h2>⚙️ System Settings</h2>
                        <p>Configure system preferences</p>
                        <button className="btn btn-primary">Settings</button>
                    </div>

                    <div className="admin-card">
                        <h2>📢 Notifications</h2>
                        <p>Send announcements to users</p>
                        <button className="btn btn-primary">Send Notification</button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminPage;
