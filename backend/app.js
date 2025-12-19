const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - DIRECT PASSWORD
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "kca_events_db",
  user: "postgres",
  password: "Francis123#",  // We know this works from earlier test
});

// Test database connection on startup
pool.query("SELECT version()")
  .then(result => {
    console.log("? PostgreSQL Connected:", result.rows[0].version.split(",")[0]);
  })
  .catch(err => {
    console.error("? Database connection failed:", err.message);
    console.log("Trying with default password...");
    
    // Try with default password
    const defaultPool = new Pool({
      host: "localhost",
      port: 5432,
      database: "kca_events_db",
      user: "postgres",
      password: "postgres",  // Common default
    });
    
    defaultPool.query("SELECT 1")
      .then(() => {
        console.log("? Connected with default password 'postgres'");
        // Replace pool with defaultPool
        module.exports.pool = defaultPool;
      })
      .catch(() => {
        console.error("? Both passwords failed. Please check PostgreSQL installation.");
      });
  });

// ==================== API ENDPOINTS ====================

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "KCA Event Management API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// 2. Database Test
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT version()");
    res.json({
      status: "success",
      message: "Database connected successfully",
      postgresVersion: result.rows[0].version
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message
    });
  }
});

// 3. Get All Events
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        title, 
        description, 
        venue, 
        TO_CHAR(start_date, 'YYYY-MM-DD HH24:MI') as start_date,
        TO_CHAR(end_date, 'YYYY-MM-DD HH24:MI') as end_date,
        capacity, 
        category,
        event_type
      FROM events 
      WHERE is_published = true
      ORDER BY start_date
    `);
    
    res.json({
      status: "success",
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// 4. Get Event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Event not found"
      });
    }
    
    res.json({
      status: "success",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// 5. Get System Statistics
app.get("/api/stats", async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const events = await pool.query("SELECT COUNT(*) FROM events WHERE is_published = true");
    const resources = await pool.query("SELECT COUNT(*) FROM resources");
    
    res.json({
      status: "success",
      data: {
        users: parseInt(users.rows[0].count),
        events: parseInt(events.rows[0].count),
        resources: parseInt(resources.rows[0].count),
        system: "KCA Event Management System",
        university: "KCA University",
        campuses: ["Ruaraka", "CBD", "Kitengela", "Mombasa"],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// 6. API Documentation
app.get("/api", (req, res) => {
  res.json({
    message: "KCA Event Management System API",
    description: "API for managing university events",
    version: "1.0.0",
    endpoints: [
      { method: "GET", path: "/api/health", description: "Health check" },
      { method: "GET", path: "/api/test-db", description: "Test database connection" },
      { method: "GET", path: "/api/events", description: "Get all published events" },
      { method: "GET", path: "/api/events/:id", description: "Get event by ID" },
      { method: "GET", path: "/api/stats", description: "Get system statistics" }
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    requestedUrl: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ==================== START SERVER ====================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`
  =============================================
  ?? KCA EVENT MANAGEMENT SERVER STARTED
  ?? Port: ${PORT}
  ?? Time: ${new Date().toLocaleString()}
  =============================================
  
  ?? API ENDPOINTS:
  ? Health:    http://localhost:${PORT}/api/health
  ? Database:  http://localhost:${PORT}/api/test-db
  ? Events:    http://localhost:${PORT}/api/events
  ? Stats:     http://localhost:${PORT}/api/stats
  ? Docs:      http://localhost:${PORT}/api
  
  ?? DATABASE:
  • Name: kca_events_db
  • User: postgres
  • Host: localhost:5432
  
  ?? TEST CREDENTIALS:
  • Admin: admin@kca.ac.ke
  • Password: Admin123
  
  =============================================
  `);
});

// Export for testing
module.exports = { app, pool };
