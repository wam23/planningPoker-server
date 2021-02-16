const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
   res.send("Hello world from A-Team");
});

app.post('/rooms/:room/vote', (req, res) => {
   const room = req.params.room;
   const name = req.body.name;
   const vote = req.body.vote;
   //console.log(`${name} voted ${vote} in room ${room}`);
   getRoom(room)[name] = vote;
   res.sendStatus(201);
});

app.get('/rooms/:room/votes', (req, res) => {
   const room = req.params.room;
   res.send(getRoom(room));
});

app.get('/rooms/:room/reset', (req, res) => {
   const room = req.params.room;
   rooms.room = {};
   console.log(`Reset room ${room}`)
   res.sendStatus(204);
});

app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`)
 })

 // in memory persistence
 const rooms = {};
 function getRoom(room) {
    if (!rooms.room) {
       rooms.room = {};
    }
    return rooms.room
 }