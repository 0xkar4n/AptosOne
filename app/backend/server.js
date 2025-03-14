const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable for security
  // user: "your_db_user",
  // host: "your_db_host",
  database: "AptosDatabase_owner",
  password: 'npg_ijWamAq8L7Dl',
  ssl: false,
});

async function pingDatabase() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()'); // Simple query to keep connection alive
    console.log('Database pinged at:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('Error pinging database:', error);
  }
}

// Ping every 10 minutes
setInterval(pingDatabase, 10 * 60 * 1000);

// Initial ping when server starts
pingDatabase();
