const authService = require("../services/auth.service.js");
const { sendSuccess } = require("../utils/response.utils.js");

const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  const newUserId = await authService.signup(email, username, password);
  sendSuccess(res, { statusCode: 201, data: { userId: newUserId } });
};

const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  const identifier = email ? email : username;
  const token = await authService.login(identifier, password);
  sendSuccess(res, {
    statusCode: 200,
    data: { token, expiresIn: "1h" },
    cookie: { name: "token", value: token },
  });
};

const logoutAll = async (req, res) => {
  const { userId } = req.user;
  await authService.invalidatePreviousAccessTokens(userId);
  res.sendStatus(200);
};

module.exports = {
  createUser,
  loginUser,
  logoutAll,
};
