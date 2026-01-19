const request = require("supertest");
const app = require("../src/app.js");

describe("GET /", () => {
  it("checks server avilability", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
  });
});






// it("creates user", async () => {
//   // test
// }, 10000);
