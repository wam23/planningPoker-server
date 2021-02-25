 // in memory persistence
 const rooms = {};
 function getRoom(room) {
    rooms[room] = rooms[room] || {}
    return rooms[room]
 }
 const fib = [0, 1, 2, 3, 5, 8, 13, 21];

function vote(room, name, vote) {
    if (!room) {
        throw 'Invalid room';
    }
    if (!name) {
        throw 'Invalid name';
    }
    if (!isVoteValid(vote)) {
        throw 'Invalid vote';
    }
    console.log(`${name} voted ${vote} in room ${room}`);
    getRoom(room)[name] = vote;
}

function isVoteValid(vote) {
    return fib.includes(parseInt(vote, 10));
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
