const request = require("supertest");
const app = require("../src/app.js");
const { connectDB } = require("../src/database.js");

beforeAll(async () => {
  await connectDB();
});

describe("GET /runs/:id", () => {
  it("returns 200 and a run JSON for an existing ID", async () => {
    const runID = "dc9822e7-72d6-4cc8-b6da-c1c5208d6109";

    const res = await request(app).get(`/runs/${runID}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);

    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("runID", runID);
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("startTime");
    expect(res.body).toHaveProperty("durationSec");
    expect(res.body).toHaveProperty("distanceMeters");

    expect(typeof res.body.durationSec).toBe("number");
    expect(typeof res.body.distanceMeters).toBe("number");
    expect(new Date(res.body.startTime).toString()).not.toBe("Invalid Date");
  });

  it("returns 404 for an non-existing ID", async () => {
    const runID = "dc9811e7-72d6-4df8-b6da-c1c5219d6109";

    const res = await request(app).get(`/runs/${runID}`);

    expect(res.statusCode).toBe(404);
    expect(res.headers["content-type"]).toMatch(/json/);

    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 for non UUID", async () => {
    const runID = "0000000000zxczv0000rgtrt0000";

    const res = await request(app).get(`/runs/${runID}`);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);

    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("error");
  });
});
