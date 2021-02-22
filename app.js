const express = require('express')
const poker = require('./poker')
const app = express()
const expressWs = require('express-ws')(app);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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

app.ws('/ws/:room', (ws, req) => {
   ws.on('message', msg => {
      console.log(msg);
   });
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
   expressWs.getWss(`/ws/${room}`).clients.forEach((client) => {
      client.send(JSON.stringify(result));
   });
}

module.exports = app;
