import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Laster inn miljøvariabler fra .env

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Kreves av Render for sikker tilkobling
  },
});

export default pool;