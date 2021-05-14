const poker = require('./poker');

beforeEach(() => {
    console.log = jest.fn();
    poker.resetAll();
    poker.vote('a', 'Andy', 5, 'ateamfibonacci');
    poker.vote('b', 'Bony', 13, 'ateamfibonacci');
});

test('reveal votes for room', () => {
    expect(poker.reveal('a', 'ateamfibonacci').Andy).toBe(5);
    expect(poker.reveal('b', 'ateamfibonacci').Bony).toBe(13);
    expect(Object.keys(poker.reveal('a', 'ateamfibonacci')).length).toBe(1);
    expect(Object.keys(poker.reveal('b', 'ateamfibonacci')).length).toBe(1);
});

test('new vote for room', () => {
    poker.vote('a', 'Carl', 3, 'ateamfibonacci');
    expect(poker.reveal('a', 'ateamfibonacci').Carl).toBe(3);
    expect(Object.keys(poker.reveal('a', 'ateamfibonacci')).length).toBe(2);
    expect(Object.keys(poker.reveal('b', 'ateamfibonacci')).length).toBe(1);
});

test('update vote for room', () => {
    poker.vote('a', 'Andy', 8, 'ateamfibonacci');
    expect(poker.reveal('a', 'ateamfibonacci').Andy).toBe(8);
    expect(Object.keys(poker.reveal('a', 'ateamfibonacci')).length).toBe(1);
    expect(Object.keys(poker.reveal('b', 'ateamfibonacci')).length).toBe(1);
});

test('vote for new room', () => {
    poker.vote('c', 'Carl', 3, 'ateamfibonacci');
    expect(Object.keys(poker.reveal('a', 'ateamfibonacci')).length).toBe(1);
    expect(Object.keys(poker.reveal('b', 'ateamfibonacci')).length).toBe(1);
    expect(Object.keys(poker.reveal('c', 'ateamfibonacci')).length).toBe(1);
});

test('reset a room', () => {
    poker.reset('a', 'ateamfibonacci');
    expect(Object.keys(poker.reveal('a', 'ateamfibonacci')).length).toBe(0);
    expect(Object.keys(poker.reveal('b', 'ateamfibonacci')).length).toBe(1);
});

test('validate vote input', () => {
    expect(() => poker.vote(null, 'b', 1, 'ateamfibonacci')).toThrow();
    expect(() => poker.vote('a', null, 1, 'ateamfibonacci')).toThrow();
    expect(() => poker.vote('a', 'b', null, 'ateamfibonacci')).toThrow();
    expect(() => poker.vote('a', 'b', 'c', 'ateamfibonacci')).toThrow();
    expect(() => poker.vote('a', 'b', -1, 'ateamfibonacci')).toThrow();
    expect(() => poker.vote('a', 'b', 4, 'ateamfibonacci')).toThrow();
    expect(() => poker.vote('a', 'b', 30, 'ateamfibonacci')).toThrow();
});
