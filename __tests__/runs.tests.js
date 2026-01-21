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

  it("returns 404 for a non-existing ID", async () => {
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

describe("POST /runs/ - Integration Tests", () => {

  const validRunData = {
    userId: "1d9a8400-07cd-466a-9d13-843a544a5b09",
    startTime: "2026-01-19T12:25:44.822Z",
    durationSec: 1800,
    distanceMeters: 5000,
  };

  it("returns 201 and id of created run with valid data", async () => {
    const res = await request(app)
      .post("/runs/")
      .send(validRunData);

    expect(res.statusCode).toBe(201);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("id");
  });


  it("returns 415 when Content-Type is not JSON", async () => {
    const res = await request(app)        
      .post('/runs')
      .set('Content-Type', 'text/plain')
      .send('not json');

    expect(res.statusCode).toBe(415);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe('Content-Type must be json.');
  });


  it("returns 400 for empty JSON", async () => {
    const res = await request(app)
      .post("/runs/")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe('Run data is missing required fields: userId, startTime, durationSec, distanceMeters.');
  });


  it("returns 400 for missing userId field", async () => {
    const { userId, ...dataWithoutUserId } = validRunData;
    const res = await request(app)
      .post("/runs/")
      .send(dataWithoutUserId);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe('Run data is missing required fields: userId.');
  });

  
  it("returns 400 for missing startTime field", async () => {
    const { startTime, ...dataWithoutStartTime } = validRunData;
    const res = await request(app)
      .post("/runs/")
      .send(dataWithoutStartTime);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe('Run data is missing required fields: startTime.');
  });

  
  it("returns 400 for missing durationSec field", async () => {
    const { durationSec, ...dataWithoutDurationSec } = validRunData;
    const res = await request(app)
      .post("/runs/")
      .send(dataWithoutDurationSec);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe('Run data is missing required fields: durationSec.');
  });

  
  it("returns 400 for missing distanceMeters field", async () => {
    const { distanceMeters, ...dataWithoutDistanceMeters } = validRunData;
    const res = await request(app)
      .post("/runs/")
      .send(dataWithoutDistanceMeters);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe('Run data is missing required fields: distanceMeters.');
  });

  it("returns 400 when field is null", async () => {
    const res = await request(app)
      .post("/runs")
      .send({ ...validRunData, userId: null });

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toContain("userId");
  });

  it("returns 400 for invalid userId format", async () => {
    const invalidRun = {
      userId: "fagfgsg5054a6wa6ew1",
      startTime: "2026-01-11T14:45:44.822Z",
      durationSec: 1550,
      distanceMeters: 1727,
    };

    const res = await request(app).post("/runs/").send(invalidRun);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 for invalid date format", async () => {
    const invalidRun = {
      userId: "1d9a8400-07cd-466a-9d13-843a544a5b09",
      startTime: "2026-31-11T14:45:44.822Z",
      durationSec: 1550,
      distanceMeters: 1727,
    };

    const res = await request(app).post("/runs/").send(invalidRun);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 for invalid duration value", async () => {
    const invalidRun = {
      userId: "1d9a8400-07cd-466a-9d13-843a544a5b09",
      startTime: "2026-01-11T14:45:44.822Z",
      durationSec: "-1455a",
      distanceMeters: 1727,
    };

    const res = await request(app).post("/runs/").send(invalidRun);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 for invalid distance value", async () => {
    const invalidRun = {
      userId: "1d9a8400-07cd-466a-9d13-843a544a5b09",
      startTime: "2026-01-11T14:45:44.822Z",
      durationSec: 1727,
      distanceMeters: "-1455a",
    };

    const res = await request(app).post("/runs/").send(invalidRun);

    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
  });
});
