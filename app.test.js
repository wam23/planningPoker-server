// use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("./app");

beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
})

beforeEach(async () => {
    // reset room
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
        .expect("Hello world from A-Team");
});

test("POST /vote should respond no content", async () => {
    await request(app)
        .post("/rooms/1/vote")
        .send({ name: 'Test2', vote: 5 })
        .expect(204);

    await request(app)
        .get("/rooms/1/votes")
        .expect("{\"Test\":3,\"Test2\":5}");
});

test("GET /votes should respond votes", async () => {
    await request(app)
        .get("/rooms/1/votes")
        .expect(200)
        .expect("{\"Test\":3}");
});

test("GET /reset should respond no content", async () => {
    await request(app)
        .get("/rooms/1/reset")
        .expect(204);

    await request(app)
        .get("/rooms/1/votes")
        .expect("{}");
});
