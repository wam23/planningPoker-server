// in memory persistence
const rooms = {};
function getRoom(room) {
    rooms[room] = rooms[room] || {votes:{}, revealor:undefined};
    return rooms[room];
}

function setRevealor(room, revealor){
    getRoom(room).revealor = revealor;
}

function getRevealor(room){
    return getRoom(room).revealor;
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
    getRoom(room).votes[name] = vote;
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
    let votes = getRoom(room).votes;
    setRevealor(room, undefined);
    if (Object.values(votes).every(vote => vote === -1)) {
        console.log(`Hard reset room ${room}`)
        getRoom(room).votes = {};
    } else {
        console.log(`Soft reset room ${room}, keeping names`)
        Object.keys(votes).forEach(name => votes[name] = -1);
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
exports.setRevealor = setRevealor;
exports.getRevealor = getRevealor;
