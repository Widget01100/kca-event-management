// ====================================================
// KCA UNIVERSITY EVENT MANAGEMENT SYSTEM - BACKEND API
// Version 2.0.0 - Ready for Production
// ====================================================

const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// KCA University Events Database (In-Memory)
const kcaEvents = [
    {
        id: "KCA-CF-2024-001",
        title: "KCA Career Fair 2024",
        description: "Annual career fair connecting KCA University students with top employers from technology, finance, and business sectors. Features resume reviews, mock interviews, and networking sessions.",
        date: "2024-03-15",
        time: "09:00 AM - 05:00 PM",
        venue: "Main Campus Auditorium",
        category: "Career",
        capacity: 500,
        registered: 342,
        organizer: "KCA Career Services",
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        status: "active"
    },
    {
        id: "KCA-SD-2024-001",
        title: "Annual Sports Day",
        description: "University-wide sports competitions featuring football, basketball, athletics, and more. All departments compete for the championship trophy.",
        date: "2024-03-20",
        time: "08:00 AM - 06:00 PM",
        venue: "University Sports Ground",
        category: "Sports",
        capacity: 1000,
        registered: 678,
        organizer: "KCA Sports Department",
        image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        status: "active"
    },
    {
        id: "KCA-TS-2024-001",
        title: "Tech Innovation Seminar",
        description: "Exploring latest trends in technology, AI, and digital transformation. Featuring guest speakers from the tech industry.",
        date: "2024-03-25",
        time: "02:00 PM - 05:00 PM",
        venue: "Tech Building Room 101",
        category: "Technology",
        capacity: 200,
        registered: 189,
        organizer: "KCA Computer Science Dept",
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        status: "active"
    }
];

// ==================== API ENDPOINTS ====================

// 1. Health Check
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "KCA Events API",
        version: "2.0.0",
        timestamp: new Date().toISOString(),
        university: "KCA University",
        motto: "Advancing Knowledge, Driving Change"
    });
});

// 2. Get All Events
app.get("/api/events", (req, res) => {
    res.json({
        success: true,
        count: kcaEvents.length,
        data: kcaEvents,
        university: "KCA University"
    });
});

// 3. Get Single Event by ID
app.get("/api/events/:id", (req, res) => {
    const event = kcaEvents.find(e => e.id === req.params.id);
    if (event) {
        res.json({ success: true, data: event });
    } else {
        res.status(404).json({ 
            success: false, 
            message: "Event not found. Try: KCA-CF-2024-001, KCA-SD-2024-001, KCA-TS-2024-001"
        });
    }
});

// 4. Get Statistics
app.get("/api/stats", (req, res) => {
    const stats = {
        total_events: kcaEvents.length,
        total_capacity: kcaEvents.reduce((sum, e) => sum + e.capacity, 0),
        total_registered: kcaEvents.reduce((sum, e) => sum + e.registered, 0),
        upcoming_events: kcaEvents.length,
        categories: [...new Set(kcaEvents.map(e => e.category))]
    };
    res.json({ success: true, data: stats });
});

// 5. API Documentation
app.get("/api", (req, res) => {
    res.json({
        name: "KCA University Event Management API",
        version: "2.0.0",
        description: "Backend API for managing university events",
        endpoints: [
            { method: "GET", path: "/api/health", description: "System health check" },
            { method: "GET", path: "/api/events", description: "Get all KCA events" },
            { method: "GET", path: "/api/events/:id", description: "Get specific event" },
            { method: "GET", path: "/api/stats", description: "Get event statistics" },
            { method: "GET", path: "/api", description: "API documentation" }
        ],
        contact: "events@kca.ac.ke",
        university: "KCA University"
    });
});

// 6. Test Database Endpoint
app.get("/api/test-db", (req, res) => {
    res.json({
        status: "mock",
        message: "Using in-memory data - no database required",
        events_count: kcaEvents.length
    });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║   🎓 KCA UNIVERSITY EVENT MANAGEMENT SYSTEM v2.0.0   ║");
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log("");
    console.log("✅ BACKEND STATUS: RUNNING");
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`🎯 Events: http://localhost:${PORT}/api/events`);
    console.log("");
    console.log("✅ FRONTEND READY: Start with 'npm start' in frontend/");
    console.log(`🔗 Frontend URL: http://localhost:3000`);
    console.log("");
    console.log("💡 No database required - using sample KCA University data");
    console.log("💡 Ready for academic submission and portfolio showcase!");
    console.log("");
    console.log("════════════════════════════════════════════════════════");
});
