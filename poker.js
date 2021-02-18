 // in memory persistence
 const rooms = {};
 function getRoom(room) {
    rooms[room] = rooms[room] || {}
    return rooms[room]
 }

function vote(room, name, vote) {
    console.log(`${name} voted ${vote} in room ${room}`);
    getRoom(room)[name] = vote;
}

function reveal(room) {
    return getRoom(room);
}

function reset(room) {
    console.log(`Reset room ${room}`)
    rooms[room] = {};
}

function resetAll() {
    for (let room in rooms) {
        rooms[room] = {}
    }
}

exports.vote = vote;
exports.reveal = reveal;
exports.reset = reset;
exports.resetAll = resetAll;