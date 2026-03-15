import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProfilePage = ({ user }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [user]);

    const fetchUserData = async () => {
        try {
            // Get user details
            setUserData(user);
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            });
            
            // Get user registrations
            const regData = await api.getUserRegistrations();
            setRegistrations(regData.data || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // In a real app, you'd call an API to update user
            alert('Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
            </div>

            <div style={styles.profileCard}>
                <div style={styles.profileHeader}>
                    <div style={styles.avatar}>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <h2 style={styles.userName}>
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p style={styles.userRole}>{user?.role}</p>
                    </div>
                </div>

                {!editMode ? (
                    <div style={styles.infoSection}>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Email:</span>
                            <span style={styles.infoValue}>{user?.email}</span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Member since:</span>
                            <span style={styles.infoValue}>
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Total registrations:</span>
                            <span style={styles.infoValue}>{registrations.length}</span>
                        </div>
                        
                        <button 
                            style={styles.editButton}
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                                disabled
                            />
                            <small style={styles.hint}>Email cannot be changed</small>
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button type="submit" style={styles.saveButton}>
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                style={styles.cancelButton}
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div style={styles.registrationsCard}>
                <h3 style={styles.sectionTitle}>My Event Registrations</h3>
                
                {registrations.length === 0 ? (
                    <p style={styles.emptyText}>You haven't registered for any events yet.</p>
                ) : (
                    <div style={styles.registrationsList}>
                        {registrations.map(reg => (
                            <div key={reg.id} style={styles.registrationItem}>
                                <div style={styles.regInfo}>
                                    <h4 style={styles.regTitle}>{reg.title}</h4>
                                    <p style={styles.regDetails}>
                                        📅 {new Date(reg.date).toLocaleDateString()} | 
                                        📍 {reg.venue}
                                    </p>
                                    <p style={styles.regStatus}>
                                        Status: {reg.status}
                                    </p>
                                </div>
                                <span style={styles.regBadge}>
                                    Registered
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    },
    header: {
        marginBottom: '30px'
    },
    title: {
        color: '#1e3c72',
        fontSize: '2rem'
    },
    profileCard: {
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee'
    },
    avatar: {
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '32px',
        fontWeight: 'bold'
    },
    userName: {
        color: '#1e3c72',
        marginBottom: '5px'
    },
    userRole: {
        color: '#7e22ce',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '14px'
    },
    infoSection: {
        padding: '10px 0'
    },
    infoRow: {
        display: 'flex',
        padding: '10px 0',
        borderBottom: '1px solid #f0f0f0'
    },
    infoLabel: {
        width: '150px',
        color: '#666',
        fontWeight: '500'
    },
    infoValue: {
        flex: 1,
        color: '#333'
    },
    editButton: {
        marginTop: '20px',
        padding: '10px 20px',
        background: '#7e22ce',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    form: {
        padding: '10px 0'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#666',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px'
    },
    hint: {
        display: 'block',
        marginTop: '5px',
        color: '#999',
        fontSize: '12px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    saveButton: {
        flex: 1,
        padding: '10px',
        background: '#1e3c72',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    cancelButton: {
        flex: 1,
        padding: '10px',
        background: '#ddd',
        color: '#666',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    registrationsCard: {
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        color: '#1e3c72',
        marginBottom: '20px'
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        padding: '40px'
    },
    registrationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    registrationItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '5px'
    },
    regInfo: {
        flex: 1
    },
    regTitle: {
        color: '#1e3c72',
        marginBottom: '5px'
    },
    regDetails: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '5px'
    },
    regStatus: {
        color: '#10b981',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    regBadge: {
        background: '#eab308',
        color: '#1e3c72',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        color: '#1e3c72'
    }
};

export default ProfilePage;
