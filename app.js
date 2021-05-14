const express = require('express')
const poker = require('./poker')
const app = express()
const cors = require('cors');
const longpoll = require('express-longpoll')(app);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.get('/', (req, res) => {
    res.send("OK");
});

app.post('/rooms/:room/:cardset/vote', (req, res) => {
    poker.vote(req.params.room, req.body.name, req.body.vote, req.params.cardset);
    updateRoom(req.params.room, req.params.cardset, false);
    res.sendStatus(204);
});

app.get('/rooms/:room/:cardset/votes', (req, res) => {
    console.log(' reveal room ' + req.params.room + ' by ' + req.header('x-user'));
    const revealor = req.header('x-user');
    const room = poker.reveal(req.params.room, req.params.cardset);
    updateRoom(req.params.room, req.params.cardset, true, revealor);
    res.send(room);
});

app.get('/rooms/:room/:cardset/reset', (req, res) => {
    console.log(' reset room ' + req.params.room + ' by ' + req.header('x-user'));
    const revealor = req.header('x-user');
    poker.reset(req.params.room, req.params.cardset)
    updateRoom(req.params.room, req.params.cardset, false, revealor);
    res.sendStatus(204);
});

app.get('/poll/:room/:cardset/init', (req, res) => {
    const url = `/poll/${req.params.room}/${req.params.cardset}`;
    if (!global.express_longpoll_emitters[url]) {
        longpoll.create(url);
    }
    res.sendStatus(204);
});

app.get('/cardset/:cardsetKey', (req, res) => {
    res.send(poker.cardsets[`${req.params.cardsetKey}`]);
});

app.get('/cardsets/', (req, res) => {
    res.send(Object.keys(poker.cardsets).map((key) => {
        return { key, cards: poker.cardsets[key] };
    }));
});

function updateRoom(room, cardset, showVote, revealor) {
    const votes = poker.reveal(room, cardset);
    const result = [];
    for (const [key, value] of Object.entries(votes)) {
        result.push({
            name: key,
            vote: showVote ? value : 0
        })
    }
    longpoll.publish(`/poll/${room}/${cardset}`, {revealor, result});
}

module.exports = app;
