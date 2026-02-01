const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation/users.validation.js");
const authorization = require("../middleware/auth.middleware.js");
const usersMiddleware = require("../middleware/users.middleware.js");
const usersController = require("../controllers/users.controller.js");

// NOTE: possibly add guard middleware to check if user is active / banned / etc.

router.get(
  "/me",
  authorization.checkAuth,
  usersMiddleware.attachUser,
  usersController.getMe,
);

router.patch(
  "/me/profile",
  validation.validateProfileUpdate,
  authorization.checkAuth,
  usersController.updateProfile,
);

router.patch(
  "/me/account",
  validation.validateAccountUpdate,
  authorization.checkAuth,
  usersController.updateAccount,
);

module.exports = router;

// IDEA: POST /users/password-reset
// {
//   "email": "user@example.com"
// }

// IDEA: POST /users/password-reset/confirm
// {
//   "token": "reset_token",
//   "newPassword": "new_password"
// }
