const poker = require('./poker');

beforeEach(() => {
    poker.resetAll();
    poker.vote('a', 'Andy', 5);
    poker.vote('b', 'Bony', 13);
});

test('reveal votes for room', () => {
    expect(poker.reveal('a').Andy).toBe(5);
    expect(poker.reveal('b').Bony).toBe(13);
    expect(Object.keys(poker.reveal('a')).length).toBe(1);
    expect(Object.keys(poker.reveal('b')).length).toBe(1);
});

test('new vote for room', () => {
    poker.vote('a', 'Carl', 3);
    expect(poker.reveal('a').Carl).toBe(3);
    expect(Object.keys(poker.reveal('a')).length).toBe(2);
    expect(Object.keys(poker.reveal('b')).length).toBe(1);
});

test('update vote for room', () => {
    poker.vote('a', 'Andy', 8);
    expect(poker.reveal('a').Andy).toBe(8);
    expect(Object.keys(poker.reveal('a')).length).toBe(1);
    expect(Object.keys(poker.reveal('b')).length).toBe(1);
});

test('vote for new room', () => {
    poker.vote('c', 'Carl', 3);
    expect(Object.keys(poker.reveal('a')).length).toBe(1);
    expect(Object.keys(poker.reveal('b')).length).toBe(1);
    expect(Object.keys(poker.reveal('c')).length).toBe(1);
});

test('reset a room', () => {
    poker.reset('a');
    expect(Object.keys(poker.reveal('a')).length).toBe(0);
    expect(Object.keys(poker.reveal('b')).length).toBe(1);
});