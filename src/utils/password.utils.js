const bcrypt = require("bcrypt");

const saltRounds = 10;
const algorithm = "bcrypt";
const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8pJ6D0sJ1uQe8kJZ9nY9E6kKq6Zq9W";

const createPasswordHash = async (plainTextPassword) => {
  const passwordHash = await bcrypt.hash(plainTextPassword, saltRounds);
  const passwordMetadata = {
    algorithm,
    updatedAt: new Date().toISOString(),
    failedLoginAttempts: 0,
    lockUntil: null,
  };
  return { passwordHash, passwordMetadata };
};

const comparePasswordHash = async (foundUser, password) => {
  const passwordHash = foundUser
    ? foundUser.credentials.passwordHash
    : DUMMY_HASH;
  const isPasswordCorrect = await bcrypt.compare(password, passwordHash);

  if (!foundUser || !isPasswordCorrect) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
};

module.exports = { createPasswordHash, comparePasswordHash };
