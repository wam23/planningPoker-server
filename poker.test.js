const poker = require('./poker');

beforeEach(() => {
    console.log = jest.fn();
    poker.resetAll();
    poker.vote('a', 'Andy', 5);
    poker.vote('b', 'Bony', 13);
});

test('reveal votes for room', () => {
    expect(poker.reveal('a').votes.Andy).toBe(5);
    expect(poker.reveal('b').votes.Bony).toBe(13);
    expect(Object.keys(poker.reveal('a').votes).length).toBe(1);
    expect(Object.keys(poker.reveal('b').votes).length).toBe(1);
});

test('new vote for room', () => {
    poker.vote('a', 'Carl', 3);
    expect(poker.reveal('a').votes.Carl).toBe(3);
    expect(Object.keys(poker.reveal('a').votes).length).toBe(2);
    expect(Object.keys(poker.reveal('b').votes).length).toBe(1);
});

test('update vote for room', () => {
    poker.vote('a', 'Andy', 8);
    expect(poker.reveal('a').votes.Andy).toBe(8);
    expect(Object.keys(poker.reveal('a').votes).length).toBe(1);
    expect(Object.keys(poker.reveal('b').votes).length).toBe(1);
});

test('vote for new room', () => {
    poker.vote('c', 'Carl', 3);
    expect(Object.keys(poker.reveal('a').votes).length).toBe(1);
    expect(Object.keys(poker.reveal('b').votes).length).toBe(1);
    expect(Object.keys(poker.reveal('c').votes).length).toBe(1);
});

test('soft reset a room', () => {
    poker.reset('a');
    expect(Object.keys(poker.reveal('a').votes).length).toBe(1);
    expect(Object.keys(poker.reveal('b').votes).length).toBe(1);
    expect(poker.reveal('a').votes).toEqual({ "Andy": -1});
});

test('hard reset a room', () => {
    poker.reset('a'); // soft reset
    poker.reset('a'); // hard reset
    expect(Object.keys(poker.reveal('a').votes).length).toBe(0);
    expect(Object.keys(poker.reveal('b').votes).length).toBe(1);
});

test('validate vote input', () => {
    expect(() => poker.vote(null, 'b', 1)).toThrow();
    expect(() => poker.vote('a', null, 1)).toThrow();
    expect(() => poker.vote('a', 'b', null)).toThrow();
    expect(() => poker.vote('a', 'b', 'XXL')).toThrow();
    expect(() => poker.vote('a', 'b', -1)).toThrow();

    poker.vote('a', 'Andy', 3);
    poker.vote('a', 'Bony', '☕');
    poker.vote('a', 'Carl', 'XL');
    poker.vote('a', 'Dan', '?');
    expect(poker.reveal('a').votes).toEqual({ "Andy": 3, "Bony": "☕", "Carl": "XL", "Dan": "?" });
});
