const auth = require("../services/auth.service.js");
const db = require("../database.js");

const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  const newUserId = auth.signup(email, username, password)  
  res.status(201).json({ id: newUserId });
};

const login = async (req, res) => {
  const { email, username, password } = req.body;
  const token = await auth.login(email, password);
  res.status(200).json({ token });
};

const getMe = (req, res) => {
  const userData = req.userDoc;
  const { _id, credentials, ...safeData } = userData;
  res.status(200).json(safeData);
};

// TODO: this functionality is used by GET users/:id, this should be refactored into admin route
const getUserById = async (req, res) => {
  const userData = await db.findUserById(req.params["id"]);
  const { _id, credentials, ...safeData } = userData;
  res.status(200).json(safeData);
};

module.exports = { createUser, login, getUserById, getMe };
