// use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("./app");

beforeEach(() => {
    console.log = jest.fn();
})

beforeEach(async () => {
    // reset room
    await request(app).get("/rooms/1/reset");
    // prefill with 1 vote
    await request(app).post("/rooms/1/vote").send({ name: 'Test', vote: 3 });
});

test("GET / should respond text", async () => {
    const response = await request(app).get("/");
    expect(response.text).toEqual("Hello world from A-Team");
    expect(response.statusCode).toBe(200);
});

test("POST /vote should respond created", async () => {
    const response = await request(app).post("/rooms/1/vote").send({ name: 'Test2', vote: 5 });
    expect(response.statusCode).toBe(201);

    const response2 = await request(app).get("/rooms/1/votes");
    expect(response2.text).toEqual("{\"Test\":3,\"Test2\":5}");
});

test("GET /votes should respond votes", async () => {
    const response = await request(app).get("/rooms/1/votes");
    expect(response.text).toEqual("{\"Test\":3}");
    expect(response.statusCode).toBe(200);
});

test("GET /reset should respond no content", async () => {
    const response = await request(app).get("/rooms/1/reset");
    expect(response.statusCode).toBe(204);

    const response2 = await request(app).get("/rooms/1/votes");
    expect(response2.text).toEqual("{}");
});
