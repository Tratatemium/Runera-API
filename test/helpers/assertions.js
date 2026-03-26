/**
 * Custom assertion helpers for common test patterns
 */

/**
 * Assert that a login response sets a valid JWT auth cookie
 * @param {Object} response - Supertest response object
 */
const expectValidJwtToken = (response) => {
  expect(response.statusCode).toBe(200);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("status", "success");
  expect(response.body).toHaveProperty("data", null);
  expect(response.headers).toHaveProperty("set-cookie");

  const tokenCookie = response.headers["set-cookie"].find((cookie) =>
    cookie.startsWith("token="),
  );
  expect(tokenCookie).toBeDefined();

  const tokenValue = tokenCookie.split(";")[0].slice("token=".length);
  expect(tokenValue.length).toBeGreaterThan(0);
  expect(tokenValue).toMatch(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
  );
};

/**
 * Assert that a run object has the correct structure and data types
 * @param {Object} run - Run object to validate
 */
const expectValidRunStructure = (run) => {
  const runData = run?.runData ?? run;

  expect(runData).toHaveProperty("runId");
  expect(runData).toHaveProperty("userId");
  expect(runData).toHaveProperty("startTime");
  expect(runData).toHaveProperty("durationSec");
  expect(runData).toHaveProperty("distanceMeters");

  expect(typeof runData.runId).toBe("string");
  expect(typeof runData.userId).toBe("string");
  expect(typeof runData.startTime).toBe("string");
  expect(typeof runData.durationSec).toBe("number");
  expect(typeof runData.distanceMeters).toBe("number");

  expect(new Date(runData.startTime).toString()).not.toBe("Invalid Date");
  expect(runData.durationSec).toBeGreaterThan(0);
  expect(runData.distanceMeters).toBeGreaterThan(0);
};

/**
 * Assert that a user object has the correct structure
 * @param {Object} user - User object to validate
 * @param {Object} expectedAccount - Expected account data
 */
const expectValidUserStructure = (user, expectedAccount = {}) => {
  const userData = user?.userData ?? user;

  expect(userData).toHaveProperty("account");
  expect(userData).toHaveProperty("profile");
  expect(userData).not.toHaveProperty("_id");
  expect(userData).not.toHaveProperty("credentials");

  if (expectedAccount.username) {
    expect(userData.account).toHaveProperty("username", expectedAccount.username);
  }
  if (expectedAccount.email) {
    expect(userData.account).toHaveProperty("email", expectedAccount.email);
  }
};

/**
 * Assert that a response is a 400 error with specific message
 * Validation errors are expected to use the object payload shape:
 * { error: { field, message } }
 * @param {Object} response - Supertest response object
 * @param {string|RegExp|Object} expectedError - Expected message/pattern or an object with field/message
 */
const expect400WithMessage = (response, expectedError) => {
  expect(response.statusCode).toBe(400);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );

  const { error } = response.body;

  if (typeof expectedError === "string") {
    expect(error.message).toBe(expectedError);
  } else {
    if (expectedError instanceof RegExp) {
      expect(error.message).toMatch(expectedError);
      return;
    }

    if (expectedError?.message != null) {
      if (typeof expectedError.message === "string") {
        expect(error.message).toBe(expectedError.message);
      } else {
        expect(error.message).toMatch(expectedError.message);
      }
    }

    if (Object.prototype.hasOwnProperty.call(expectedError || {}, "field")) {
      expect(error.field).toBe(expectedError.field);
    }
  }
};

/**
 * Assert that a response is a 401 error
 * @param {Object} response - Supertest response object
 */
const expect401Error = (response) => {
  expect(response.statusCode).toBe(401);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
};

/**
 * Assert that a response is a 403 error
 * @param {Object} response - Supertest response object
 */
const expect403Error = (response) => {
  expect(response.statusCode).toBe(403);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
};

/**
 * Assert that a response is a 404 error
 * @param {Object} response - Supertest response object
 */
const expect404Error = (response) => {
  expect(response.statusCode).toBe(404);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
};

/**
 * Assert that a response is a 409 error
 * @param {Object} response - Supertest response object
 */
const expect409Error = (response) => {
  expect(response.statusCode).toBe(409);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
};

/**
 * Assert that a response is a 409 error
 * @param {Object} response - Supertest response object
 */
const expect415Error = (response) => {
  expect(response.statusCode).toBe(400);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
};

/**
 * Common assertions for successful JSON responses
 * @param {Object} response - Supertest response object
 * @param {number} expectedStatus - Expected HTTP status code (default 200)
 */
const expectJsonResponse = (response, expectedStatus = 200) => {
  expect(response.statusCode).toBe(expectedStatus);
  expect(response.headers["content-type"]).toMatch(/json/);
};

module.exports = {
  expectValidJwtToken,
  expectValidRunStructure,
  expectValidUserStructure,
  expect400WithMessage,
  expect401Error,
  expect403Error,
  expect404Error,
  expect409Error,
  expect415Error,
  expectJsonResponse,
};
