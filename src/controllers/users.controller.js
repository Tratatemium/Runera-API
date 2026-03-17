const usersService = require("../services/users.service.js");
const authService = require("../services/auth.service.js");
const { sendSuccess } = require("../utils/response.utils.js");

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const userData = await usersService.getUser(userId);
  sendSuccess(res, { statusCode: 200, data: { userData } });
};

const getAllUsers = async (req, res) => {
  const usersData = await usersService.getAllUsers();
  sendSuccess(res, {
    statusCode: 200,
    data: { userId: newUserId },
    extra: { results: usersData.length },
  });
};

const getMe = async (req, res) => {
  const userId = req.user.userId;
  const userData = await usersService.getUser(userId);
  sendSuccess(res, { statusCode: 200, data: { userData } });
};

const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const profile = req.body.profile;
  const savedProfile = await usersService.updateProfile(userId, profile);
  sendSuccess(res, { statusCode: 200, data: { savedProfile } });
};

const updateAccount = async (req, res) => {
  const { userId, email: currentEmail } = req.user;
  const currentPassword = req.body.currentPassword;
  await authService.authenticateUser(currentEmail, currentPassword);

  const fieldToUpdate = req.fieldToUpdate;
  if (!fieldToUpdate) {
    throw new Error("req.fieldToUpdate must be provided in middleware.");
  }
  await usersService.updateAccount(userId, fieldToUpdate, req.body);
  await authService.invalidatePreviousAccessTokens(userId);
  res.sendStatus(200);
};

module.exports = {
  getUserById,
  getAllUsers,
  getMe,
  updateProfile,
  updateAccount,
};
