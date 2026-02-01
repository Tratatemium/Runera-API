const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation/auth.validation.js");
const authorization = require("../middleware/auth.middleware.js");
const authController = require("../controllers/auth.controller.js");

router.post(
  "/signup",
  validation.validateRegisterRequest,
  authController.createUser,
);

router.post(
  "/login",
  validation.validateLoginRequest,
  authController.loginUser,
);

router.post("/logout-all", authorization.checkAuth, authController.logoutAll);

module.exports = router;
