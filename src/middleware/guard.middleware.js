const { GuardError } = require("../errors/errors.js");
const runsService = require("../services/runs.service.js");

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
      if (!isAdmin) throw new GuardError("Admins only.");
      return next();
    }

    const isOwner = await checkOwnership(req, param, type);
    if (mode === "owner" && !isOwner) throw new GuardError("Owners only.");
    else if (mode === "either" && !isAdmin && !isOwner) throw new GuardError();

    next();
  };
};

module.exports = { checkPermissions };
