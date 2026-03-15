const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbDir = path.join(__dirname, '..', '..', 'database');
const dbPath = path.join(dbDir, 'kca_events.db');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// ============ DATABASE QUERIES ============

const dbQueries = {
    // Get all events with category names (CLEAN VERSION)
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    e.id,
                    e.title,
                    e.description,
                    e.date,
                    e.time,
                    e.venue,
                    e.category_id,
                    c.name as category_name,
                    e.capacity,
                    e.registered,
                    e.organizer,
                    e.image_url,
                    e.created_by,
                    e.status,
                    e.created_at
                FROM events e
                LEFT JOIN categories c ON e.category_id = c.id
                WHERE e.status = 'active'
                ORDER BY e.date ASC
            `, [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching events:', err);
                    reject(err);
                } else {
                    console.log(`📊 API returning ${rows?.length || 0} events`);
                    resolve(rows || []);
                }
            });
        });
    },

    // Get single event by ID
    getEventById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT e.*, c.name as category_name 
                FROM events e
                LEFT JOIN categories c ON e.category_id = c.id
                WHERE e.id = ?
            `, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get user registrations with event details
    getRegistrationsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    r.*, 
                    e.title, 
                    e.date, 
                    e.time, 
                    e.venue, 
                    e.category_id,
                    c.name as category_name
                FROM registrations r
                JOIN events e ON r.event_id = e.id
                LEFT JOIN categories c ON e.category_id = c.id
                WHERE r.user_id = ? AND r.status = 'confirmed'
                ORDER BY e.date ASC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    // Get all registrations with user and event details
    getAllRegistrations: () => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    r.*,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.role,
                    e.title as event_title,
                    e.date as event_date,
                    e.venue,
                    c.name as category_name
                FROM registrations r
                JOIN users u ON r.user_id = u.id
                JOIN events e ON r.event_id = e.id
                LEFT JOIN categories c ON e.category_id = c.id
                WHERE r.status = 'confirmed'
                ORDER BY r.registered_at DESC
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    // Get detailed statistics
    getDetailedStats: () => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    (SELECT COUNT(*) FROM events WHERE status = 'active') as total_events,
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM categories) as total_categories,
                    (SELECT COUNT(*) FROM registrations WHERE status = 'confirmed') as total_registrations,
                    (SELECT COUNT(*) FROM events WHERE date >= date('now') AND status = 'active') as upcoming_events
            `, [], (err, row) => {
                if (err) reject(err);
                else {
                    db.all(`
                        SELECT 
                            c.name,
                            COUNT(e.id) as event_count
                        FROM categories c
                        LEFT JOIN events e ON c.id = e.category_id AND e.status = 'active'
                        GROUP BY c.id, c.name
                        ORDER BY c.name
                    `, [], (err, categoryRows) => {
                        if (err) reject(err);
                        else {
                            resolve({
                                total_events: row?.total_events || 0,
                                total_users: row?.total_users || 0,
                                total_categories: row?.total_categories || 0,
                                total_registrations: row?.total_registrations || 0,
                                upcoming_events: row?.upcoming_events || 0,
                                categories: categoryRows || []
                            });
                        }
                    });
                }
            });
        });
    },

    // Register for event
    registerForEvent: (userId, eventId) => {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO registrations (user_id, event_id) VALUES (?, ?)', [userId, eventId], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        reject(new Error('Already registered for this event'));
                    } else {
                        reject(err);
                    }
                } else {
                    db.run('UPDATE events SET registered = registered + 1 WHERE id = ?', [eventId]);
                    resolve({ id: this.lastID });
                }
            });
        });
    },

    // Cancel registration
    cancelRegistration: (registrationId, userId, userRole) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM registrations WHERE id = ?', [registrationId], (err, reg) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!reg) {
                    reject(new Error('Registration not found'));
                    return;
                }
                if (userRole !== 'admin' && reg.user_id !== userId) {
                    reject(new Error('Unauthorized: You can only cancel your own registrations'));
                    return;
                }

                db.run('DELETE FROM registrations WHERE id = ?', [registrationId], function(err) {
                    if (err) reject(err);
                    else {
                        db.run('UPDATE events SET registered = registered - 1 WHERE id = ?', [reg.event_id]);
                        resolve({ changes: this.changes });
                    }
                });
            });
        });
    },

    // Get all users
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, email, first_name, last_name, role, is_active, created_at, last_login FROM users ORDER BY id', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    // Get user by email
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get user by ID
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, email, first_name, last_name, role, is_active, created_at, last_login FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Create user
    createUser: (userData) => {
        return new Promise((resolve, reject) => {
            const { email, password, firstName, lastName, role } = userData;
            db.run(
                'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
                [email, password, firstName, lastName, role || 'student'],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, email, firstName, lastName, role: role || 'student' });
                }
            );
        });
    },

    // Update user
    updateUser: (id, userData) => {
        return new Promise((resolve, reject) => {
            const { firstName, lastName, role, is_active } = userData;
            db.run(
                `UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), role = COALESCE(?, role), is_active = COALESCE(?, is_active) WHERE id = ?`,
                [firstName, lastName, role, is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    },

    // Delete user
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            if (id == 1) {
                reject(new Error('Cannot delete the main admin account'));
                return;
            }
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    // Get all categories
    getAllCategories: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    // Update last login
    updateLastLogin: (userId) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    // Mark attendance
    markAttendance: (registrationId) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE registrations SET attendance_marked = 1 WHERE id = ?', [registrationId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    // Create event
    createEvent: (eventData) => {
        return new Promise((resolve, reject) => {
            const { id, title, description, date, time, venue, category_id, capacity, organizer, image_url, created_by } = eventData;
            db.run(
                `INSERT INTO events (id, title, description, date, time, venue, category_id, capacity, organizer, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, title, description, date, time, venue, category_id, capacity, organizer, image_url, created_by],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id });
                }
            );
        });
    },

    // Update event
    updateEvent: (id, eventData, userId, userRole) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT created_by FROM events WHERE id = ?', [id], (err, event) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!event) {
                    reject(new Error('Event not found'));
                    return;
                }
                if (userRole !== 'admin' && event.created_by !== userId) {
                    reject(new Error('Unauthorized: You can only edit your own events'));
                    return;
                }

                const { title, description, date, time, venue, category_id, capacity, organizer, image_url, status } = eventData;
                db.run(
                    `UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description), date = COALESCE(?, date), time = COALESCE(?, time), venue = COALESCE(?, venue), category_id = COALESCE(?, category_id), capacity = COALESCE(?, capacity), organizer = COALESCE(?, organizer), image_url = COALESCE(?, image_url), status = COALESCE(?, status) WHERE id = ?`,
                    [title, description, date, time, venue, category_id, capacity, organizer, image_url, status, id],
                    function(err) {
                        if (err) reject(err);
                        else resolve({ changes: this.changes });
                    }
                );
            });
        });
    },

    // Delete event
    deleteEvent: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM registrations WHERE event_id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                });
            });
        });
    }
};

const initializeDatabase = async () => {
    return new Promise((resolve) => {
        resolve();
    });
};

module.exports = {
    db,
    initializeDatabase,
    ...dbQueries
};
