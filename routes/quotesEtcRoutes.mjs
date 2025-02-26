import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import { eventLogger } from '../modules/log.mjs';

const router = express.Router();

router.get("/tmp/poem", (req, res) => {
    const poem = `
      Roser er røde
      Fioler er blå
      Druer er søte
      og du er like så
    `;

    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
});

router.get("/tmp/quote", (req, res) => {
    const quotes = [
      "Aldri så galt at det ikke er godt for noe.",
      "Alle gode ting er tre.",
      "Alle veier fører til Rom.",
      "Den som er med på leken, må tåle steken.",
      "Det er bedre med en fugl i hånda enn ti på taket."
    ];
  
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
});

router.post('/tmp/sum/:a/:b', (req, res) => {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b); 
    const sum = a + b;
  
    res.status(HTTP_CODES.SUCCESS.OK).send(`The sum of ${a} and ${b} is ${sum}`).end();
});

export default router;
