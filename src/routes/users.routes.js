const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller.js");
const authentication = require("../middleware/authentication/auth.middleware.js");
const guard = require("../middleware/authentication/guard.middleware.js");
const validation = require("../middleware/validation/users.validation.js");

router.post(
  "/signup",
  validation.validateRegisterRequest,
  usersController.createUser,
);

router.post("/login", validation.validateLoginRequest, usersController.login);

router.get("/users/me", authentication.checkAuth)
router.get(
  "/:id",
  authentication.checkAuth,
  validation.validateUUID("id"),
  guard.checkOwnership("id"),
  usersController.getUserById,
); // TODO: this functionality is moved to GET users/me, this should be refactored into admin route

module.exports = router;
