import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));


function getRoot(req, res, next) {
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