// in memory persistence
const rooms = {};
function getRoom(room) {
    rooms[room] = rooms[room] || {};
    return rooms[room];
}

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
    getRoom(room)[name] = vote;
}

function isVoteValid(vote) {
    if (typeof vote === 'number' && vote >= 0) return true;
    if (typeof vote === 'string' && vote.length <= 2) return true;
    return false;
}

function reveal(room) {
    return getRoom(room);
}

function reset(room) {
    let roomObj = getRoom(room);
    if (Object.values(roomObj).every(vote => vote === -1)) {
        console.log(`Hard reset room ${room}`)
        rooms[room] = {};
    } else {
        console.log(`Soft reset room ${room}, keeping names`)
        Object.keys(roomObj).forEach(name => roomObj[name] = -1);
    }
}

function resetAll() {
    for (let room in rooms) {
        rooms[room] = {};
    }
}

exports.vote = vote;
exports.reveal = reveal;
exports.reset = reset;
exports.resetAll = resetAll;
