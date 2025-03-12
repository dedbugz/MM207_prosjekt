import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import HTTP_CODES from '../utils/httpCodes.mjs';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error(`⚠️  Feil ${HTTP_CODES.CLIENT_ERROR.BAD_REQUEST}: DATABASE_URL er ikke satt!`);
    process.exit(1);  // Stopper programmet hvis database-URL mangler
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } 
  });

// Test databaseforbindelse
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error(`❌ Feil ${HTTP_CODES.CLIENT_ERROR.BAD_REQUEST}: Databaseforbindelse mislyktes:`, err);
    } else {
        console.log(`✅ ${HTTP_CODES.SUCCESS.OK}: Database tilkoblet:`, res.rows[0]);
    }
});

export default pool;
