const { verifyToken } = require("../utils/jwt.utils.js");
const userRepo = require("../repositories/users.repository.js");
const { AuthError } = require("../errors/errors.js");

const checkTokenVersion = async (tokenData) => {
  const storedUser = await userRepo.findUserById(tokenData.userId);
  if (!storedUser) throw new AuthError("Invalid token.");

  const { accessTokenVersion: incomingVersion } = tokenData;
  const storedVersion = storedUser.auth?.accessTokenVersion;

  const isVersionValid = (incomingVersion, storedVersion) =>
    incomingVersion != null &&
    storedVersion != null &&
    incomingVersion === storedVersion;

  if (!isVersionValid(incomingVersion, storedVersion))
    throw new AuthError("Invalid token.");
};

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new AuthError("Missing authentication token.");

  const userData = verifyToken(token);

  await checkTokenVersion(userData);

  req.user = userData;
  next();
};

module.exports = { checkAuth };
