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
    console.log("Testing database connection...\n");
    
    const client = await pool.connect();
    
    // Test users
    const users = await client.query("SELECT COUNT(*) as count, MAX(email) as sample_email FROM users");
    console.log("? Users table: " + users.rows[0].count + " users");
    console.log("   Sample: " + users.rows[0].sample_email + "\n");
    
    // Test events - simpler query
    const events = await client.query("SELECT COUNT(*) as count FROM events");
    console.log("? Events table: " + events.rows[0].count + " events");
    
    // Get event titles
    const eventTitles = await client.query("SELECT title FROM events LIMIT 5");
    console.log("   Sample events:");
    for (let i = 0; i < eventTitles.rows.length; i++) {
      console.log("   " + (i + 1) + ". " + eventTitles.rows[i].title);
    }
    console.log();
    
    // Test resources
    const resources = await client.query("SELECT COUNT(*) as count FROM resources");
    console.log("? Resources table: " + resources.rows[0].count + " resources\n");
    
    // Get full event details
    const allEvents = await client.query("SELECT title, venue, start_date FROM events ORDER BY start_date");
    console.log("?? All Events:");
    for (let i = 0; i < allEvents.rows.length; i++) {
      const event = allEvents.rows[i];
      const date = new Date(event.start_date).toLocaleDateString();
      console.log("   • " + event.title);
      console.log("     ?? " + event.venue);
      console.log("     ???  " + date + "\n");
    }
    
    console.log("?? Database setup successful! All tables created with sample data.");
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error("? Database test failed:", error.message);
  }
}

test();
