const express = require('express')
const poker = require('./poker')
const app = express()
const cors = require('cors');
const longpoll = require('express-longpoll')(app);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.get('/', (req, res) => {
   res.send("Hello world from A-Team");
});

app.post('/rooms/:room/vote', (req, res) => {
   poker.vote(req.params.room, req.body.name, req.body.vote);
   updateRoom(req.params.room, false);
   res.sendStatus(204);
});

app.get('/rooms/:room/votes', (req, res) => {
   const room = poker.reveal(req.params.room);
   updateRoom(req.params.room, true);
   res.send(room);
});

app.get('/rooms/:room/reset', (req, res) => {
   poker.reset(req.params.room)
   updateRoom(req.params.room, false);
   res.sendStatus(204);
});

app.get('/poll/:room/init', (req, res) => {
   const url = `/poll/${req.params.room}`;
   if (!global.express_longpoll_emitters[url]) {
      longpoll.create(url);
   }
   res.sendStatus(204);
});

function updateRoom(room, showVote) {
   const votes = poker.reveal(room);
   const result = [];
   for (const [key, value] of Object.entries(votes)) {
      result.push({
         name: key,
         vote: showVote ? value : 0
      })
   }
   longpoll.publish(`/poll/${room}`, result);
}

module.exports = app;
