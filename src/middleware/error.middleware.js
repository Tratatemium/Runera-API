const { sendError, capitalize } = require("../utils/response.utils");

const apiErrorHandler = (err, req, res, next) => {
  // --- JSON parse errors ---
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    err.status = 400;
    err.name = "InvalidJsonError";
    err.message = "Invalid JSON payload.";
  }

  // --- MongoDB connection errors ---
  const isConnectionError =
    err.name === "MongoServerSelectionError" ||
    err.name === "MongoNetworkError";

  if (isConnectionError) {
    err.status = 500;
    err.name = "DatabaseError";
    err.message = "Failed to connect to database.";
  }

  // --- Duplicate key errors ---
  const isDuplicateKey = err.name === "MongoServerError" && err.code === 11000;

  if (isDuplicateKey) {
    const rawField = Object.keys(err.keyValue || {})[0];
    const value = rawField ? err.keyValue[rawField] : undefined;
    const field = rawField?.slice(rawField.lastIndexOf(".") + 1);
    err.status = 409;
    err.name = "DuplicateKeyError";
    err.field = field;
    err.message = field
      ? capitalize(`${field} ${value} already exists.`)
      : "Data already exists";
  }

  // --- JWT errors ---
  const jwtErrors = [
    "JsonWebTokenError",
    "TokenExpiredError",
    "NotBeforeError",
  ];
  if (jwtErrors.includes(err.name)) {
    err.status = 401;

    if (err.name === "TokenExpiredError") err.message = "Token expired.";
    else if (err.name === "JsonWebTokenError") err.message = "Invalid token.";
    else if (err.name === "NotBeforeError")
      err.message = "Token not active yet.";

    err.name = "AuthError";
  }

  // --- Log server errors ---
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  // --- Send error response ---
  sendError(res, err);
};

module.exports = { apiErrorHandler };
