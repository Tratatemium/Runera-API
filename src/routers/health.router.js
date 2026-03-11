const express = require("express");
const healthRouter = express.Router();

const { healthController } = require("../controllers/health.controller.js");

app.get("/", healthController);

module.exports = healthRouter;
