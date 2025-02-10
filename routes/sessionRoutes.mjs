import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import fs from 'fs';

const router = express.Router();
const FileStoreSession = FileStore(session);
const sessionDir = './sessions';

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir);
}

router.use(session({
    store: new FileStoreSession({ path: sessionDir }),
    secret: 'hemmeligNøkkel',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

router.get('/session', (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 1;
    } else {
        req.session.visits++;
    }
    res.send(`Antall besøk: ${req.session.visits}`);
});

export default router;
