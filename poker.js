// in memory persistence
const rooms = {};

function getRoom(room) {
    rooms[room] = rooms[room] || {}
    return rooms[room]
}

const cardsets = {
    ateamfibonacci: [1, 2, 3, 5, 8, 13, 21, '?'],
    fullfibonacci: [1, 2, 3, 5, 8, 13, 21, 40, 100, '∞', '?', '☕']
};

function vote(room, name, vote, cardsetKey) {

    if (!room) {
        throw 'Invalid room';
    }
    if (!name) {
        throw 'Invalid name';
    }
    if (!isVoteValid(vote, cardsets[cardsetKey])) {
        throw 'Invalid vote';
    }
    console.log(`${name} voted ${vote} in room ${room} with cardset ${cardsetKey}`);
    getRoom(room + cardsetKey)[name] = vote;
}

function isVoteValid(vote, cardset) {
    return vote === '-' || cardset.includes(vote);
}

function reveal(room, cardsetKey) {
    return getRoom(room + cardsetKey);
}

function reset(room, cardsetKey) {
    console.log(`Reset room ${room}`)
    rooms[room + cardsetKey] = {};
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
exports.cardsets = cardsets;
