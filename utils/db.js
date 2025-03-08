import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL || "postgresql://mm207_db_user:YUleNWJXxwCJMrvWPtyLZbGJFI3oeblU@dpg-cv63jd7noe9s73bqj39g-a/mm207_db";

const pool = new Pool({
    connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});


export default pool;
