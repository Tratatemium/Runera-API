const request = require("supertest");
const app = require("../../src/app.js");

describe("POST /users/login - Integration Tests", () => {
  // Using pre-seeded test users
  const testUser1 = {
    username: "test_runner_01",
    password: "TestPassword123!",
    email: "runner01@test.com",
  };

  const testUser2 = {
    username: "test_runner_02",
    password: "SecurePass456!",
    email: "runner02@test.com",
  };

  describe("Content-Type validation", () => {
    it("returns 415 when Content-Type is not JSON", async () => {
      const res = await request(app)
        .post("/users/login")
        .set("Content-Type", "text/plain")
        .send("not json");

      expect(res.statusCode).toBe(415);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Content-Type must be json.");
    });
  });

  describe("Required fields validation", () => {
    it("returns 400 for empty JSON", async () => {
      const res = await request(app).post("/users/login").send({});

      expect(res.statusCode).toBe(400);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe(
        "User data is missing required fields: username, password, email.",
      );
    });

    it("returns 400 for missing username field", async () => {
      const { username, ...dataWithoutUsername } = testUser1;
      const res = await request(app).post("/users/login").send(dataWithoutUsername);

      expect(res.statusCode).toBe(400);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe(
        "User data is missing required fields: username.",
      );
    });

    it("returns 400 for missing password field", async () => {
      const { password, ...dataWithoutPassword } = testUser1;
      const res = await request(app).post("/users/login").send(dataWithoutPassword);

      expect(res.statusCode).toBe(400);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe(
        "User data is missing required fields: password.",
      );
    });

    it("returns 400 for missing email field", async () => {
      const { email, ...dataWithoutEmail } = testUser1;
      const res = await request(app).post("/users/login").send(dataWithoutEmail);

      expect(res.statusCode).toBe(400);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe(
        "User data is missing required fields: email.",
      );
    });
  });

  describe("Authentication validation", () => {
    it("returns 401 for incorrect password", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({
          username: testUser1.username,
          email: testUser1.email,
          password: "WrongPassword123!",
        });

      expect(res.statusCode).toBe(401);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 401 for non-existent email", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({
          username: "validuser123",
          email: "nonexistent@example.com",
          password: "ValidPassword123!",
        });

      expect(res.statusCode).toBe(401);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("Successful login", () => {
    it("returns 200 and token for valid credentials", async () => {
      const res = await request(app).post("/users/login").send(testUser1);

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.body).toHaveProperty("token");
      expect(typeof res.body.token).toBe("string");
      expect(res.body.token.length).toBeGreaterThan(0);
    });

    it("returns valid JWT token structure", async () => {
      const res = await request(app).post("/users/login").send(testUser2);

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    it("allows multiple logins with same credentials", async () => {
      const res1 = await request(app).post("/users/login").send(testUser1);
      const res2 = await request(app).post("/users/login").send(testUser1);

      expect(res1.statusCode).toBe(200);
      expect(res2.statusCode).toBe(200);
      expect(res1.body).toHaveProperty("token");
      expect(res2.body).toHaveProperty("token");
    });
  });
});