const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller.js");

router.post("/new-user", usersController.postNewUser);

module.exports = router;
