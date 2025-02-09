import express from 'express'
import session from 'express-session';
import FileStore from 'session-file-store';
import fs from 'fs';
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';

const ENABLE_LOGGING = false;
const server = express();
const port = process.env.PORT || 8000;

const logger = log(LOGG_LEVELS.VERBOSE);
server.set('port', port);
server.use(logger);
server.use(express.static('public')); //kobler alt som ligger i public mappe ut i verden

//________Session storage_______________________________________________________

const FileStoreSession = FileStore(session);
const sessionDir = './sessions';
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir);
}

server.use(session({
  store: new FileStoreSession({ path: sessionDir }),
  secret: 'hemmeligNøkkel',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

server.get('/session', (req, res) => {
  if (!req.session.visits) {
      req.session.visits = 1;
  } else {
      req.session.visits++;
  }
  res.send(`Antall besøk: ${req.session.visits}`);
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

  res.status(HTTP_CODES.SUCCESS.CREATED).send({deck_id: deckId}).end(); 
});



server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
  const { deck_id } = req.params;
    console.log('Deck ID Received:', deck_id);

  const deck = decks[deck_id];
  if (!deck) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: 'Deck not found' }).end();
  }

  //shuffle logikk
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  res.status(HTTP_CODES.SUCCESS.OK).send({ message: 'Deck is shuffled', deck }).end();
});



server.get('/temp/deck/:deck_id', (req, res) => {
  const {deck_id} = req.params;
  const deck = decks[deck_id];

    console.log('Got Deck:', deck_id);
  if (!deck) {
      return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({error: 'Deck is not found' });
  }

  res.status(HTTP_CODES.SUCCESS.OK).send({deck});
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


//________Oppstart_______________________________________________________

function getRoot(req, res, next) {
    eventLogger("Noen spurte etter root");
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}


function getPoem(req, res, next) {
    const poem = `
      Roser er røde
      Fioler er blå
      Druer er søte
      og du er like så
    `;

    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}


function getQuote(req, res, next) {
    const quotes = [
      "Aldri så galt at det ikke er godt for noe.",
      "Alle gode ting er tre.",
      "Alle veier fører til Rom.",
      "Den som er med på leken, må tåle steken.",
      "Det er bedre med en fugl i hånda enn ti på taket."
    ];
  
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}


function getSum(req, res, next) {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b); 
    const sum = a + b;
  
    res.status(HTTP_CODES.SUCCESS.OK).send(`The sum of ${a} and ${b} is ${sum}`).end();
  }


server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);
server.post('/tmp/sum/:a/:b', getSum);


server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});