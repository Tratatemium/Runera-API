const { verifyToken } = require("../utils/jwt.utils.js");
const userRepo = require("../repositories/users.repository.js");

const throwAuthError = (message, status = 401) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

const checkTokenVersion = async (tokenData) => {
  const storedUser = await userRepo.findUserById(tokenData.userId);
  if (!storedUser) throwAuthError("Invalid token.");

  const { accessTokenVersion: incomingVersion } = tokenData;
  const storedVersion = storedUser.auth?.accessTokenVersion;

  const isVersionValid = (incomingVersion, storedVersion) =>
    incomingVersion != null &&
    storedVersion != null &&
    incomingVersion === storedVersion;

  if (!isVersionValid(incomingVersion, storedVersion))
    throwAuthError("Invalid token.");
};

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throwAuthError("Missing authorization token.");

  const userData = verifyToken(token);

  await checkTokenVersion(userData);

  req.user = userData;
  next();
};

module.exports = { checkAuth };
