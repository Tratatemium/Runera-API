const request = require("supertest");
const app = require("../src/app.js");

const { connectDB } = require("../src/database.js");

beforeAll(async () => {
  await connectDB();
});

describe("Users API", () => {
  it("dummy test to ensure suite runs", () => {
    expect(true).toBe(true);
  });
});

// it("creates user", async () => {
//   // test
// }, 10000);

