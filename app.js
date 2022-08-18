const express = require('express')
const poker = require('./poker')
const app = express()
const cors = require('cors');
const longpoll = require('express-longpoll')(app);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.get('/', (req, res) => {
   res.send("OK");
});

app.post('/rooms/:room/vote', (req, res) => {
   poker.vote(req.params.room.toLowerCase(), req.body.name, req.body.vote);
   updateRoom(req.params.room.toLowerCase(), false);
   res.sendStatus(204);
});

app.get('/rooms/:room/votes', (req, res) => {
   console.log(` reveal room ${req.params.room.toLowerCase()} by ${req.header('x-user')}`);
   const room = poker.reveal(req.params.room.toLowerCase());
   updateRoom(req.params.room.toLowerCase(), true, req.header('x-user'));
   res.send(room);
});

app.get('/rooms/:room/reset', (req, res) => {
   console.log(` reset room ${req.params.room.toLowerCase()} by ${req.header('x-user')}`);
   poker.reset(req.params.room.toLowerCase())
   updateRoom(req.params.room.toLowerCase(), false, req.header('x-user'));
   res.sendStatus(204);
});

app.get('/poll/:room/init', (req, res) => {
   const url = `/poll/${req.params.room.toLowerCase()}`;
   if (!global.express_longpoll_emitters[url]) {
      longpoll.create(url);
   }
   const result = votesAsArray(req.params.room.toLowerCase(), true);
   res.send(result);
});

// @deprecated
app.get('/cardset', (req, res) => {
   res.send([1, 2, 3, 5, 8, 13, 21, '?']);
});

function updateRoom(room, showVote, revealor) {
   const result = votesAsArray(room, showVote);
   longpoll.publish(`/poll/${room.toLowerCase()}`, {revealor, result});
}

function votesAsArray(room, showVote) {
   const votes = poker.reveal(room.toLowerCase());
   const result = [];
   for (const [key, value] of Object.entries(votes)) {
      result.push({
         name: key,
         vote: (showVote || value === -1) ? value : 0
      })
   }
   return result;
}

module.exports = app;
