const express = require("express");
const router = express.Router();

const { parseAndValidateUser } = require("../validation/validation.js");
const { createPasswordHash } = require("../authentication/hashing.js");
const { addNewUser } = require("../database.js");

router.post("/new-user", async (req, res) => {
  const { userData, plainTextPassword } = parseAndValidateUser(req);
  const passwordHash = await createPasswordHash(plainTextPassword);
  const newUser = { ...userData, password: passwordHash };
  const newUserID = await addNewUser(newUser);
  res.status(201).send(`New user ID: ${newUserID}`);
});

module.exports = router;
