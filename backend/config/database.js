const { Pool } = require("pg");
require("dotenv").config();

console.log("?? Database config loading...");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD length:", process.env.DB_PASSWORD?.length);

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "kca_events_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Francis123#", // Fallback to direct password
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("? Error connecting to PostgreSQL:", err.message);
    console.log("Connection details:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      passwordLength: process.env.DB_PASSWORD?.length
    });
  } else {
    console.log("? Successfully connected to PostgreSQL database");
    release();
  }
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
