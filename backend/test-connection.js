const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "kca_events_db",
  user: "postgres",
  password: "Francis123#"
});

async function test() {
  try {
    console.log("Testing PostgreSQL connection...");
    
    const client = await pool.connect();
    console.log("? Connected to database!");
    
    // Test simple query
    const result = await client.query("SELECT version()");
    console.log("PostgreSQL Version:", result.rows[0].version);
    
    // Test if tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log("\n?? Tables in database:");
    tables.rows.forEach(table => {
      console.log("  -", table.table_name);
    });
    
    // Count records
    const users = await client.query("SELECT COUNT(*) FROM users");
    const events = await client.query("SELECT COUNT(*) FROM events");
    
    console.log("\n?? Record counts:");
    console.log("  Users:", users.rows[0].count);
    console.log("  Events:", events.rows[0].count);
    
    client.release();
    await pool.end();
    
    console.log("\n?? Database connection successful!");
    
  } catch (error) {
    console.error("? Connection failed:", error.message);
    console.log("\n?? Troubleshooting:");
    console.log("1. Check if password 'Francis123#' is correct");
    console.log("2. Check if PostgreSQL service is running");
    console.log("3. Try connecting with pgAdmin to verify credentials");
  }
}

test();
