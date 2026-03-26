const { NotFoundError } = require("../errors/errors.js");
const usersRepo = require("../repositories/users.repository.js");
const authService = require("./auth.service.js");

const throwUserNotFoundError = (userId) => {
  throw new NotFoundError(`No user with ID ${userId} found!`);
};

const getUser = async (userId) => {
  const userData = await usersRepo.findUserById(userId);
  if (!userData) throwUserNotFoundError(userId);
  return userData;
};

const getAllUsers = async () => {
  const usersData = await usersRepo.findAllUsers();
  return usersData;
};

const updateProfile = async (userId, profilePatch) => {
  const savedProfile = await usersRepo.updateProfile(userId, profilePatch);
  if (!savedProfile) throwUserNotFoundError(userId);
  return savedProfile;
};

const updateAccount = async (userId, fieldToUpdate, reqBody) => {
  const updateHandlers = {
    password: (userId, reqBody) =>
      authService.updatePassword(userId, reqBody.newPassword),
    email: (userId, reqBody) =>
      usersRepo.updateAccount(userId, "email", reqBody.newEmail),
    username: (userId, reqBody) =>
      usersRepo.updateAccount(userId, "username", reqBody.newUsername),
  };

  const handler = updateHandlers[fieldToUpdate];
  if (!handler) {
    throw new Error("Invalid fieldToUpdate");
  }

  const result = await handler(userId, reqBody);
  if (result?.matchedCount === 0) throwUserNotFoundError(userId);
};

module.exports = { getUser, getAllUsers, updateProfile, updateAccount };
