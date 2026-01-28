const checkOwnership = (param = "id") => {
  return (req, res, next) => {
    const resourceId = req.params[param];
    const providedId = req.user.userId;
    if (providedId !== resourceId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to perform this action." });
    }
    next();
  };
};

const checkUserExists = async () => {

}

module.exports = { checkOwnership, checkUserExists };