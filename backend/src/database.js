const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                venue TEXT NOT NULL,
                category TEXT NOT NULL,
                capacity INTEGER NOT NULL,
                registered INTEGER DEFAULT 0,
                organizer TEXT NOT NULL,
                image_url TEXT,
                created_by INTEGER,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                event_id TEXT NOT NULL,
                registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'confirmed',
                attendance_marked INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (event_id) REFERENCES events(id),
                UNIQUE(user_id, event_id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT
            )
        `, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const seedData = () => {
    return new Promise((resolve, reject) => {
        const categories = [
            ['Career', 'Career fairs and job opportunities'],
            ['Sports', 'Athletic competitions'],
            ['Technology', 'Tech talks and innovation'],
            ['Academic', 'Lectures and symposiums'],
            ['Networking', 'Alumni and professional events']
        ];

        const catStmt = db.prepare(`INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)`);
        categories.forEach(cat => catStmt.run(cat));
        catStmt.finalize();

        const users = [
            ['admin@kca.ac.ke', 'Admin123!', 'System', 'Admin', 'admin'],
            ['staff@staff.kca.ac.ke', 'Staff123!', 'Jane', 'Smith', 'staff'],
            ['student@students.kca.ac.ke', 'Student123!', 'John', 'Doe', 'student']
        ];

        const userStmt = db.prepare(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`);
        users.forEach(user => userStmt.run(user));
        userStmt.finalize();

        db.get('SELECT id FROM users WHERE email = ?', ['admin@kca.ac.ke'], (err, admin) => {
            if (err || !admin) {
                reject(err || new Error('Admin not found'));
                return;
            }

            const events = [
                ['KCA-CF-2024-001', 'KCA Career Fair 2024', 'Annual career fair connecting students with top employers', '2024-03-15', '09:00 AM - 05:00 PM', 'Main Auditorium', 'Career', 500, 342, 'KCA Career Services', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'active', admin.id],
                ['KCA-SD-2024-001', 'Annual Sports Day', 'University-wide sports competitions', '2024-03-20', '08:00 AM - 06:00 PM', 'Sports Ground', 'Sports', 1000, 678, 'KCA Sports Department', 'https://images.unsplash.com/photo-1546519638-68e109498ffc', 'active', admin.id],
                ['KCA-TS-2024-001', 'Tech Innovation Seminar', 'Latest trends in technology', '2024-03-25', '02:00 PM - 05:00 PM', 'Tech Building', 'Technology', 200, 189, 'KCA CS Dept', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 'active', admin.id],
                ['KCA-AC-2024-001', 'Research Symposium', 'Student and faculty research showcase', '2024-04-05', '10:00 AM - 04:00 PM', 'Library Hall', 'Academic', 300, 156, 'KCA Research Office', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d', 'active', admin.id],
                ['KCA-NW-2024-001', 'Alumni Networking Night', 'Connect with successful alumni', '2024-04-12', '06:00 PM - 09:00 PM', 'Alumni Center', 'Networking', 150, 98, 'KCA Alumni Relations', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', 'active', admin.id]
            ];

            const eventStmt = db.prepare(`INSERT OR IGNORE INTO events (id, title, description, date, time, venue, category, capacity, registered, organizer, image_url, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            events.forEach(event => eventStmt.run(event));
            eventStmt.finalize();

            resolve();
        });
    });
};

const dbQueries = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM events WHERE status = "active" ORDER BY date', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getEventById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    createEvent: (eventData) => {
        return new Promise((resolve, reject) => {
            const { id, title, description, date, time, venue, category, capacity, organizer, image_url, created_by } = eventData;
            db.run(
                `INSERT INTO events (id, title, description, date, time, venue, category, capacity, organizer, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, title, description, date, time, venue, category, capacity, organizer, image_url, created_by],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id });
                }
            );
        });
    },

    updateEvent: (id, eventData, userId, userRole) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT created_by FROM events WHERE id = ?', [id], (err, event) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (userRole !== 'admin' && event.created_by !== userId) {
                    reject(new Error('Unauthorized: You can only edit your own events'));
                    return;
                }

                const { title, description, date, time, venue, category, capacity, organizer, image_url, status } = eventData;
                db.run(
                    `UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description), date = COALESCE(?, date), time = COALESCE(?, time), venue = COALESCE(?, venue), category = COALESCE(?, category), capacity = COALESCE(?, capacity), organizer = COALESCE(?, organizer), image_url = COALESCE(?, image_url), status = COALESCE(?, status) WHERE id = ?`,
                    [title, description, date, time, venue, category, capacity, organizer, image_url, status, id],
                    function(err) {
                        if (err) reject(err);
                        else resolve({ changes: this.changes });
                    }
                );
            });
        });
    },

    deleteEvent: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

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

    cancelRegistration: (registrationId, userId, userRole) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM registrations WHERE id = ?', [registrationId], (err, reg) => {
                if (err) {
                    reject(err);
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

    getRegistrationsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT r.*, e.title, e.date, e.time, e.venue, e.category
                FROM registrations r
                JOIN events e ON r.event_id = e.id
                WHERE r.user_id = ? AND r.status = 'confirmed'
                ORDER BY r.registered_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getAllRegistrations: () => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT r.*, u.email, u.first_name, u.last_name, e.title as event_title, e.date as event_date
                FROM registrations r
                JOIN users u ON r.user_id = u.id
                JOIN events e ON r.event_id = e.id
                ORDER BY r.registered_at DESC
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getRegistrationsByEvent: (eventId) => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT r.*, u.email, u.first_name, u.last_name
                FROM registrations r
                JOIN users u ON r.user_id = u.id
                WHERE r.event_id = ? AND r.status = 'confirmed'
                ORDER BY r.registered_at ASC
            `, [eventId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    markAttendance: (registrationId) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE registrations SET attendance_marked = 1 WHERE id = ?', [registrationId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    getStats: () => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    COUNT(*) as total_events,
                    SUM(capacity) as total_capacity,
                    SUM(registered) as total_registered,
                    COUNT(CASE WHEN date >= date('now') THEN 1 END) as upcoming_events
                FROM events WHERE status = 'active'
            `, [], (err, row) => {
                if (err) reject(err);
                else {
                    db.all('SELECT DISTINCT category FROM events', [], (err, categories) => {
                        if (err) reject(err);
                        else {
                            resolve({
                                ...row,
                                categories: categories.map(c => c.category)
                            });
                        }
                    });
                }
            });
        });
    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, email, first_name, last_name, role, is_active, created_at FROM users', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

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

    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    getAllCategories: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

const initializeDatabase = async () => {
    try {
        await initDatabase();
        await seedData();
        console.log('✅ Database initialized with sample data');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

module.exports = {
    db,
    initializeDatabase,
    ...dbQueries
};
