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
    cookie: { name: "token", value: token },
  });
};

const logout = async (req, res) => {
  res.cookie(cookie.name, "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    partitioned: true,
    maxAge: 0,
    ...cookie.options,
  });
  sendSuccess(res, {
    statusCode: 200,
    data: { message: "Logged out successfully." },
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
  logout,
  logoutAll,
};
