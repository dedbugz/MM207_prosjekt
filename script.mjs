import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

// Funksjon for root ("/")
function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}
server.get("/", getRoot);


// Funksjon for "/tmp/poem"
function getPoem(req, res, next) {
    const poem = `
      Roser er røde
      Fioler er blå
      Druer er søte
      og du er like så
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}
server.get("/tmp/poem", getPoem);


// Funksjon for "/tmp/quote"
function getQuote(req, res, next) {
    const quotes = [
      "Aldri så galt at det ikke er godt for noe.",
      "Alle gode ting er tre.",
      "Alle veier fører til Rom.",
      "Den som er med på leken, må tåle steken.",
      "Det er bedre med en fugl i hånda enn ti på taket."
    ];
  
    // Velg et tilfeldig sitat
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}
server.get("/tmp/quote", getQuote);


// Starter serveren
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});