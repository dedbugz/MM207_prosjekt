import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
import pool from './utils/db.js';
import log from './modules/log.mjs';
import { LOGG_LEVELS } from './modules/log.mjs';
import dotenv from "dotenv";

// Importer routes for session og oppstartsfunksjoner
import sessionRoutes from './routes/sessionRoutes.mjs';


import recipeRouter from './routes/recipesRoutes.mjs';

const ENABLE_LOGGING = false;
const server = express();
const port = process.env.PORT || 8000;
const logger = log(LOGG_LEVELS.VERBOSE);

server.set('port', port);
server.use(logger);
server.use(express.static('public'));
server.use(express.json());

//________Teste databaseforbindelse____________________________________

dotenv.config();


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

server.use('/api/recipes', recipeRouter);

//________Matapp_______________________________________________________

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//oppskrifts-appen på root ("/")
server.get("/", (req, res) => {
    console.log("Root ble spurt etter - sender oppskriftsapp.html");
    res.sendFile(path.join(__dirname, "public/html/oppskriftsapp.html"));
});
server.get("/service-worker.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/js/service-worker.js"));
});


//________Bruk av eksterne routes_______________________________________________________
server.use('/', sessionRoutes);

server.listen(port, () => {
  console.log(`✅ Server kjører på port ${port}`);
});
