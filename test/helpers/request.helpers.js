/**
 * Helper functions for common request patterns and assertions
 */

/**
 * Common assertions for error responses
 * @param {Object} response - Supertest response object
 * @param {number} expectedStatus - Expected HTTP status code
 */
const expectErrorResponse = (response, expectedStatus) => {
  expect(response.statusCode).toBe(expectedStatus);
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
 * Test cases for authentication validation (401 errors)
 * Returns an array of test case objects
 */
const getAuthValidationTests = () => [
  {
    name: "returns 401 when no auth cookie is provided",
    setupAuth: (req) => req,
  },
  {
    name: "returns 401 when cookie is malformed",
    setupAuth: (req) => req.set("Cookie", "token"),
  },
  {
    name: "returns 401 for invalid token",
    setupAuth: (req) => req.set("Cookie", "token=invalid.token.here"),
  },
];

/**
 * Test cases for Content-Type validation (415 errors)
 */
const getContentTypeTests = () => [
  {
    name: "returns 415 when Content-Type is not JSON",
    contentType: "text/plain",
    body: "not json",
  },
];

/**
 * Generate test cases for missing required fields
 * @param {Object} validData - Valid data object
 * @param {Array<string>} requiredFields - List of required field names
 * @returns {Array<Object>} Test case objects
 */
const getMissingFieldTests = (validData, requiredFields) => {
  return requiredFields.map((field) => {
    const { [field]: omitted, ...dataWithoutField } = validData;
    return {
      name: `returns 400 for missing ${field} field`,
      data: dataWithoutField,
      field,
    };
  });
};

module.exports = {
  expectErrorResponse,
  getAuthValidationTests,
  getContentTypeTests,
  getMissingFieldTests,
};
