const express = require('express')
const poker = require('./poker')
const app = express()
const cors = require('cors');
const uuid = require('uuid');
const longpoll = require('express-longpoll')(app);

let subscribers = [];

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
   const result = votesAsArray(req.params.room.toLowerCase(), false);
   res.send(result);
});

// @deprecated
app.get('/cardset', (req, res) => {
   res.send([1, 2, 3, 5, 8, 13, 21, '?']);
});

app.get('/events', events);
app.get('/send-event/:val', sendEvent);

function events(request, response, next) {
   const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
   };

   response.writeHead(200, headers);

   const subscriberId = uuid.v4();
   const data = `data: ${JSON.stringify({id: subscriberId})}\n\n`;

   response.write(data);

   const subscriber = {
      id: subscriberId,
      response
   };

   subscribers.push(subscriber);

   request.on('close', () => {
      console.log(`${subscriberId} Connection closed`);
      subscribers = subscribers.filter(sub => sub.id !== subscriberId);
   });
}

async function sendEvent(request, response, next) {
   const val = request.params.val.toLowerCase();
   subscribers.forEach(subscriber => subscriber.response.write(`data: ${JSON.stringify(val)}\n\n`));

   response.json({success: true});
}

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
