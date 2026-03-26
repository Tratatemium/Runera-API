const request = require("supertest");
const app = require("../../src/app.js");

/**
 * Login and get authentication cookie for a user
 * @param {Object} credentials - User credentials (email or username + password)
 * @returns {Promise<string>} Cookie header value (token=...)
 */
const getAuthToken = async (credentials) => {
  const loginRes = await request(app).post("/api/v1/auth/login").send(credentials);
  
  if (loginRes.statusCode !== 200) {
    throw new Error(`Login failed with status ${loginRes.statusCode}: ${JSON.stringify(loginRes.body)}`);
  }

  const setCookie = loginRes.headers["set-cookie"];
  if (!Array.isArray(setCookie) || setCookie.length === 0) {
    throw new Error(`Login response is missing set-cookie header: ${JSON.stringify(loginRes.headers)}`);
  }

  return setCookie[0].split(";")[0];
};

/**
 * Create a new user via signup endpoint
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user response body
 */
const createUser = async (userData) => {
  const response = await request(app).post("/api/v1/auth/signup").send(userData);
  
  if (response.statusCode !== 201) {
    throw new Error(`User creation failed with status ${response.statusCode}: ${JSON.stringify(response.body)}`);
  }
  
  return response.body;
};

/**
 * Create a new user and get their auth cookie in one step
 * @param {Object} userData - User registration data
 * @returns {Promise<{user: Object, token: string}>} Created user and cookie value
 */
const createUserAndGetToken = async (userData) => {
  const user = await createUser(userData);
  const token = await getAuthToken({
    email: userData.email,
    password: userData.password,
  });
  
  return { user, token };
};

/**
 * Make authenticated request with auth cookie
 * @param {Function} requestFn - Supertest request function
 * @param {string} token - Cookie header value from getAuthToken (token=...)
 * @returns {Object} Supertest request object with Cookie header set
 */
const authenticatedRequest = (requestFn, token) => {
  return requestFn.set("Cookie", token);
};

module.exports = {
  getAuthToken,
  createUser,
  createUserAndGetToken,
  authenticatedRequest,
};
