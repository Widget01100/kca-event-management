const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./src/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
database.initializeDatabase();

// ============ AUTH MIDDLEWARE ============
const getCurrentUser = (req) => {
    const userId = req.headers['x-user-id'] || req.body?.userId || 1;
    const userRole = req.headers['x-user-role'] || req.body?.userRole || 'student';
    return { id: parseInt(userId), role: userRole };
};

// ============ API ENDPOINTS ============

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: "healthy",
        service: "KCA Events API",
        version: "2.0.0",
        timestamp: new Date().toISOString(),
        university: "KCA University",
        motto: "Advancing Knowledge, Driving Change",
        database: "SQLite"
    });
});

// Get All Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await database.getAllEvents();
        res.json({ success: true, count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Single Event
app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await database.getEventById(req.params.id);
        if (event) {
            res.json({ success: true, data: event });
        } else {
            res.status(404).json({ success: false, message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create Event
app.post('/api/events', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role === 'student') {
            return res.status(403).json({ success: false, message: "Students cannot create events" });
        }

        const { title, description, date, time, venue, category, capacity, organizer, image_url } = req.body;
        
        const year = new Date(date).getFullYear();
        const categoryCode = category.substring(0, 2).toUpperCase();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const eventId = `KCA-${categoryCode}-${year}-${random}`;
        
        const eventData = {
            id: eventId,
            title,
            description,
            date,
            time,
            venue,
            category,
            capacity: parseInt(capacity),
            organizer,
            image_url: image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            created_by: user.id
        };
        
        await database.createEvent(eventData);
        res.json({ success: true, message: 'Event created successfully', event_id: eventId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update Event
app.put('/api/events/:id', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        await database.updateEvent(req.params.id, req.body, user.id, user.role);
        res.json({ success: true, message: 'Event updated successfully' });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            res.status(403).json({ success: false, error: error.message });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

// Delete Event
app.delete('/api/events/:id', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only admins can delete events" });
        }
        await database.deleteEvent(req.params.id);
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Register for Event
app.post('/api/events/:id/register', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        const registration = await database.registerForEvent(user.id, req.params.id);
        res.json({ success: true, message: "Successfully registered", registration_id: registration.id });
    } catch (error) {
        if (error.message.includes('Already registered')) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

// Cancel Registration
app.delete('/api/registrations/:id', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        await database.cancelRegistration(req.params.id, user.id, user.role);
        res.json({ success: true, message: "Registration cancelled" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get User Registrations
app.get('/api/user/registrations', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        const registrations = await database.getRegistrationsByUser(user.id);
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get All Registrations (Staff/Admin)
app.get('/api/registrations', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role === 'student') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const registrations = await database.getAllRegistrations();
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Event Registrations (Staff/Admin)
app.get('/api/events/:id/registrations', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role === 'student') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const registrations = await database.getRegistrationsByEvent(req.params.id);
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark Attendance
app.put('/api/registrations/:id/attendance', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role === 'student') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await database.markAttendance(req.params.id);
        res.json({ success: true, message: "Attendance marked" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await database.getStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get All Users (Admin only)
app.get('/api/users', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const users = await database.getAllUsers();
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update User (Admin only)
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await database.updateUser(req.params.id, req.body);
        res.json({ success: true, message: "User updated" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete User (Admin only)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await database.deleteUser(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        
        if (!email.endsWith('@kca.ac.ke') && !email.endsWith('@students.kca.ac.ke') && !email.endsWith('@staff.kca.ac.ke')) {
            return res.status(400).json({ success: false, message: "Use a valid KCA email address" });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        
        const existingUser = await database.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = await database.createUser({
            email, password, firstName, lastName, role: role || 'student'
        });

        res.json({ success: true, message: "Account created", user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await database.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Current User
app.get('/api/auth/me', async (req, res) => {
    try {
        const user = getCurrentUser(req);
        const userData = await database.getUserById(user.id);
        if (userData) {
            res.json({ success: true, user: userData });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await database.getAllCategories();
        res.json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test Database
app.get('/api/test-db', async (req, res) => {
    try {
        const events = await database.getAllEvents();
        res.json({
            status: "connected",
            message: "SQLite database is working",
            events_count: events.length,
            university: "KCA University"
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// Database Admin View
app.get('/api/admin/database', async (req, res) => {
    try {
        const events = await database.getAllEvents();
        const users = await database.getAllUsers();
        const registrations = await database.getAllRegistrations();
        const categories = await database.getAllCategories();
        
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>KCA Database Admin</title>
            <style>
                body { font-family: Arial; background: #f5f5f5; padding: 20px; }
                h1 { color: #1e3c72; }
                .card { background: white; border-radius: 10px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                table { width: 100%; border-collapse: collapse; }
                th { background: #1e3c72; color: white; padding: 10px; text-align: left; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                .badge { background: #7e22ce; color: white; padding: 3px 10px; border-radius: 15px; font-size: 12px; }
                .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 20px; }
                .stat-card { background: white; padding: 20px; border-radius: 10px; text-align: center; }
                .stat-number { font-size: 24px; font-weight: bold; color: #1e3c72; }
            </style>
        </head>
        <body>
            <h1>KCA University Database Admin</h1>
            <div class="stats">
                <div class="stat-card"><div class="stat-number">${users.length}</div><div>Users</div></div>
                <div class="stat-card"><div class="stat-number">${events.length}</div><div>Events</div></div>
                <div class="stat-card"><div class="stat-number">${registrations.length}</div><div>Registrations</div></div>
                <div class="stat-card"><div class="stat-number">${categories.length}</div><div>Categories</div></div>
            </div>
            
            <div class="card">
                <h2>Users (${users.length})</h2>
                <table>
                    <tr><th>ID</th><th>Email</th><th>Name</th><th>Role</th></tr>`;
        users.forEach(u => {
            html += `<tr><td>${u.id}</td><td>${u.email}</td><td>${u.first_name} ${u.last_name}</td><td><span class="badge">${u.role}</span></td></tr>`;
        });
        html += `</table></div>
            
            <div class="card">
                <h2>Events (${events.length})</h2>
                <table>
                    <tr><th>ID</th><th>Title</th><th>Date</th><th>Venue</th><th>Registered</th></tr>`;
        events.forEach(e => {
            html += `<tr><td>${e.id}</td><td>${e.title}</td><td>${e.date}</td><td>${e.venue}</td><td>${e.registered}/${e.capacity}</td></tr>`;
        });
        html += `</table></div>
            
            <div class="card">
                <h2>Registrations (${registrations.length})</h2>
                <table>
                    <tr><th>ID</th><th>User</th><th>Event</th><th>Status</th><th>Attended</th></tr>`;
        registrations.forEach(r => {
            html += `<tr><td>${r.id}</td><td>${r.email}</td><td>${r.event_title}</td><td>${r.status}</td><td>${r.attendance_marked ? '✅' : '❌'}</td></tr>`;
        });
        html += `</table></div>
        </body></html>`;
        
        res.send(html);
    } catch (error) {
        res.status(500).send("Error loading database");
    }
});

// API Documentation
app.get('/api', (req, res) => {
    res.json({
        name: "KCA University Event Management API",
        version: "2.0.0",
        description: "Backend API for managing university events",
        endpoints: [
            { method: "GET", path: "/api/health", description: "System health check" },
            { method: "GET", path: "/api/events", description: "Get all events" },
            { method: "GET", path: "/api/events/:id", description: "Get specific event" },
            { method: "POST", path: "/api/events", description: "Create event (staff/admin)" },
            { method: "PUT", path: "/api/events/:id", description: "Update event" },
            { method: "DELETE", path: "/api/events/:id", description: "Delete event (admin)" },
            { method: "POST", path: "/api/events/:id/register", description: "Register for event" },
            { method: "GET", path: "/api/user/registrations", description: "Get my registrations" },
            { method: "GET", path: "/api/stats", description: "Get statistics" },
            { method: "POST", path: "/api/auth/register", description: "Register new user" },
            { method: "POST", path: "/api/auth/login", description: "Login" },
            { method: "GET", path: "/api/users", description: "Get all users (admin)" },
            { method: "GET", path: "/api/categories", description: "Get categories" },
            { method: "GET", path: "/api/test-db", description: "Test database" },
            { method: "GET", path: "/api/admin/database", description: "Database admin view" }
        ],
        contact: "events@kca.ac.ke",
        university: "KCA University"
    });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('   🎓 KCA UNIVERSITY EVENT MANAGEMENT SYSTEM v2.0.0');
    console.log('='.repeat(60));
    console.log(`   ✅ Backend running on port ${PORT}`);
    console.log(`   🔗 API: http://localhost:${PORT}/api`);
    console.log(`   📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`   🗄️  Admin: http://localhost:${PORT}/api/admin/database`);
    console.log('='.repeat(60));
    console.log(`   🔑 Test Credentials:`);
    console.log(`      student@students.kca.ac.ke / Student123!`);
    console.log(`      staff@staff.kca.ac.ke / Staff123!`);
    console.log(`      admin@kca.ac.ke / Admin123!`);
    console.log('='.repeat(60));
});
