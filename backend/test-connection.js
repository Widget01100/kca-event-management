const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kca_events_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Francis123#'
});

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...');
  console.log('Host:', pool.options.host);
  console.log('Database:', pool.options.database);
  console.log('User:', pool.options.user);
  
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', result.rows[0].version);
    
    // Check if our database exists
    const dbResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1", 
      [pool.options.database]
    );
    
    if (dbResult.rows.length > 0) {
      console.log(`✅ Database "${pool.options.database}" exists`);
    } else {
      console.log(`❌ Database "${pool.options.database}" does not exist`);
      console.log('Creating database...');
      await client.query(`CREATE DATABASE ${pool.options.database}`);
      console.log(`✅ Created database "${pool.options.database}"`);
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check if PostgreSQL service is running');
    console.log('2. Verify password is correct');
    console.log('3. Try these common PostgreSQL passwords:');
    console.log('   - postgres');
    console.log('   - password');
    console.log('   - (empty/blank)');
    console.log('   - admin');
    console.log('   - root');
    
    process.exit(1);
  }
}

testConnection();
