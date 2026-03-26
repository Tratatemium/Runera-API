class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

class ValidationError extends ApiError {
  constructor(message, status, field) {
    super(message || "Invalid input.", status || 400);
    this.name = "ValidationError";
    this.field = field;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class LoginError extends ApiError {
  constructor(message) {
    super(message || "Invalid credentials.", 401);
    this.name = "LoginError";
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}

class AuthError extends ApiError {
  constructor(message) {
    super(message || "Authentication failed.", 401);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

class GuardError extends ApiError {
  constructor(message) {
    super(message || "You are not allowed to perform this action.", 403);
    this.name = "GuardError";
    Object.setPrototypeOf(this, GuardError.prototype);
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message || "Not found.", 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

module.exports = {
  ApiError,
  ValidationError,
  LoginError,
  AuthError,
  GuardError,
  NotFoundError,
};
