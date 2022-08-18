// use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("./app");

beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
})

beforeEach(async () => {
    // hard reset room
    await request(app)
        .get("/rooms/1/reset");
    await request(app)
        .get("/rooms/1/reset");

    // prefill with 1 vote
    await request(app)
        .post("/rooms/1/vote")
        .send({ name: 'Test', vote: 3 });
});

test("GET / should respond text", async () => {
    await request(app)
        .get("/")
        .expect(200)
        .expect('OK');
});

test("POST /vote should respond no content", async () => {
    await request(app)
        .post("/rooms/1/vote")
        .send({ name: 'Test2', vote: 5 })
        .expect(204);

    await request(app)
        .get("/rooms/1/votes")
        .expect('{"votes":{"Test":3,"Test2":5}}');
});

test("POST /vote invalid should respond server error", async () => {
    await request(app)
        .post("/rooms/1/vote")
        .send({ name: null, vote: null })
        .expect(500);
});

test("GET /votes should respond votes", async () => {
    await request(app)
        .get("/rooms/1/votes")
        .expect(200)
        .expect('{"votes":{"Test":3}}');
});

test("GET /reset should respond no content", async () => {
    await request(app)
        .get("/rooms/1/reset")
        .expect(204);

    await request(app)
        .get("/rooms/1/votes")
        .expect('{"votes":{"Test":-1}}');
});

test("room is case insensitiv", async () => {
    await request(app)
        .get("/rooms/foo/reset");
    await request(app)
        .post("/rooms/foo/vote")
        .send({ name: 'A', vote: 1 });
    await request(app)
        .post("/rooms/Foo/vote")
        .send({ name: 'B', vote: 2 });
    await request(app)
        .post("/rooms/Foo/vote")
        .send({ name: 'C', vote: 3 });

    await request(app)
        .get("/rooms/foo/votes")
        .expect('{"votes":{"A":1,"B":2,"C":3}}');
    await request(app)
        .get("/rooms/FOO/votes")
        .expect('{"votes":{"A":1,"B":2,"C":3}}');
    await request(app)
        .get("/rooms/Foo/votes")
        .expect('{"votes":{"A":1,"B":2,"C":3}}');
});

test("GET /init should respond older content", async () => {
    await request(app)
        .get("/poll/1/init")
        .expect(200)
        .expect('{"votes":[{"name":"Test","vote":0}]}');
});

describe("Long Polling", () => {
    beforeEach(async () => {
        await request(app)
            .get("/poll/1/init")
            .expect(200);
    });

    test("POST /vote should update polling", async () => {
        setTimeout(async () => {
            await request(app)
                .post("/rooms/1/vote")
                .send({ name: 'Test2', vote: 5 })
                .expect(204);
        }, 10);
        await request(app)
            .get(("/poll/1"))
            .expect(200)
            .expect('{"result":[{"name":"Test","vote":0},{"name":"Test2","vote":0}]}');
    })

    test("GET /votes should update polling", async () => {
        setTimeout(async () => {
            await request(app)
                .get("/rooms/1/votes")
                .expect(200);
        }, 10);
        await request(app)
            .get(("/poll/1"))
            .expect(200)
            .expect('{"result":[{"name":"Test","vote":3}]}');
    })

    test("GET /reset should update polling", async () => {
        setTimeout(async () => {
            await request(app)
                .get("/rooms/1/reset")
                .expect(204);
        }, 10);
        await request(app)
            .get(("/poll/1"))
            .expect(200)
            .expect('{"result":[{"name":"Test","vote":-1}]}');
    })
});
