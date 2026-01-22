const testDb = require("./testDB.setup.js");

beforeAll(async () => {
  testDb.setup();
});

afterAll(async () => {
  testDb.clear();
  testDb.teardown();
});
