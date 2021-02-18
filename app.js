const express = require('express')
const poker = require('./poker')
const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
   res.send("Hello world from A-Team");
});

app.post('/rooms/:room/vote', (req, res) => {
   poker.vote(req.params.room, req.body.name, req.body.vote);
   res.sendStatus(204);
});

app.get('/rooms/:room/votes', (req, res) => {
   const room = poker.reveal(req.params.room);
   res.send(room);
});

app.get('/rooms/:room/reset', (req, res) => {
   poker.reset(req.params.room)
   res.sendStatus(204);
});

module.exports = app;
