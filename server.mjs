import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
import pool from './utils/db.js';
import log from './modules/log.mjs';
import { LOGG_LEVELS } from './modules/log.mjs';
import dotenv from "dotenv";

// Importer routes for session og oppstartsfunksjoner
import sessionRoutes from './routes/sessionRoutes.mjs';
import quotesEtcRoutes from './routes/quotesEtcRoutes.mjs';

const ENABLE_LOGGING = false;
const server = express();
const port = process.env.PORT || 8000;
const logger = log(LOGG_LEVELS.VERBOSE);

server.set('port', port);
server.use(logger);
server.use(express.static('public'));

//________Teste databaseforbindelse____________________________________

dotenv.config();


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});


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


//________Kortstokk_______________________________________________________

const decks = {};

function createDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

server.post('/temp/deck', (req, res) => {
  const deck = createDeck();
  const deckId = Math.random().toString(36).substring(2, 10);
  decks[deckId] = deck;

  res.status(HTTP_CODES.SUCCESS.CREATED).send({ deck_id: deckId }).end();
});

server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
  const { deck_id } = req.params;
  console.log('Deck ID Received:', deck_id);
  const deck = decks[deck_id];

  if (!deck) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: 'Deck not found' }).end();
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  res.status(HTTP_CODES.SUCCESS.OK).send({ message: 'Deck is shuffled', deck }).end();
});

server.get('/temp/deck/:deck_id', (req, res) => {
  const { deck_id } = req.params;
  const deck = decks[deck_id];

  console.log('Got Deck:', deck_id);
  if (!deck) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: 'Deck is not found' });
  }

  res.status(HTTP_CODES.SUCCESS.OK).send({ deck });
});

server.get('/temp/deck/:deck_id/card', (req, res) => {
  const { deck_id } = req.params;
  const deck = decks[deck_id];

  if (!deck) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: 'Deck not found' }).end();
  }
  if (deck.length === 0) {
    return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send({ error: 'No cards left in the deck' }).end();
  }

  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck.splice(cardIndex, 1)[0];

  console.log('Card Drawn:', card);

  res.status(HTTP_CODES.SUCCESS.OK).send({ card });
});


//________Bruk av eksterne routes_______________________________________________________
server.use('/', sessionRoutes);
server.use('/', quotesEtcRoutes);

server.listen(port, () => {
  console.log(`✅ Server kjører på port ${port}`);
});
