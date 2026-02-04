const runsService = require("../services/runs.service.js");

const throwGuardError = (
  message = "You are not allowed to perform this action.",
  status = 403,
) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

const ownershipResolvers = {
  userId: async (req, param) => req.params[param],
  runId: async (req, param) => {
    const runId = req.params[param];
    const run = await runsService.getRunById(runId);
    return run.userId;
  },
};

const checkOwnership = async (req, param, type) => {
  const providedId = req.user.userId;
  const resolver = ownershipResolvers[type];
  if (!resolver) throw new Error(`Unknown id type: ${type}`);

  let resourceId = await resolver(req, param);
  return providedId === resourceId;
};

const checkPermissions = ({ mode = "either", param = "id", type }) => {
  if (!["admin", "owner", "either"].includes(mode)) {
    throw new Error('mode must be: "admin", "owner" or "either."');
  }

  return async (req, res, next) => {
    const isAdmin = req.user.role === "admin";
    if (mode === "admin") {
      if (!isAdmin) throwGuardError("Admins only.");
      return next();
    }

    const isOwner = await checkOwnership(req, param, type);
    if (mode === "owner" && !isOwner) throwGuardError("Owners only.");
    else if (mode === "either" && !isAdmin && !isOwner) throwGuardError();

    next();
  };
};

module.exports = { checkPermissions };
