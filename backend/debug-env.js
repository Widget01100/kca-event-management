// Debug script to check environment variables
console.log("=== Debugging Environment Variables ===");
require("dotenv").config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***" + process.env.DB_PASSWORD.slice(-3) : "NOT SET");
console.log("DB_PASSWORD length:", process.env.DB_PASSWORD?.length);

// Test direct connection
const { Pool } = require("pg");

const pool1 = new Pool({
  host: "localhost",
  port: 5432,
  database: "kca_events_db",
  user: "postgres",
  password: "Francis123#",
});

const pool2 = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testConnection(pool, name) {
  try {
    const client = await pool.connect();
    console.log(`? ${name}: Connected successfully`);
    const result = await client.query("SELECT version()");
    console.log(`   PostgreSQL: ${result.rows[0].version.split(',')[0]}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`? ${name}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log("\n=== Testing Connections ===");
  
  const directSuccess = await testConnection(pool1, "Direct connection");
  const envSuccess = await testConnection(pool2, "Environment connection");
  
  console.log("\n=== Summary ===");
  console.log("Direct connection (hardcoded password):", directSuccess ? "?" : "?");
  console.log("Environment connection (.env file):", envSuccess ? "?" : "?");
  
  if (!envSuccess) {
    console.log("\n?? Solution: Use direct password in config/database.js");
  }
  
  await pool1.end();
  await pool2.end();
}

runTests();
