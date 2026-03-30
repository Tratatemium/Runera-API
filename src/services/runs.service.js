const { NotFoundError } = require("../errors/errors.js");
const runsRepo = require("../repositories/runs.repository.js");
const { getStartOfDay } = require("../utils/runs.utils.js");

const throwRunNotFoundError = (runId) => {
  throw new NotFoundError(`No run with ID ${runId} found!`);
};

const createRun = async (newRun) => {
  const enriched = {
    ...newRun,
    date: getStartOfDay(newRun.startTime),
    paceSecPerKm: newRun.durationSec / (newRun.distanceMeters / 1000),
  };
  return await runsRepo.addNewRun(enriched);
};

const getRunsByUser = async (userId) => {
  const runs = await runsRepo.findRunsByUserId(userId);
  return runs;
};

const getRunById = async (runId) => {
  const runData = await runsRepo.findRunById(runId);
  if (!runData) throwRunNotFoundError(runId);
  return runData;
};

const updateRunById = async (runId, runUpdate) => {
  const runData = await runsRepo.updateRunById(runId, runUpdate);
  if (!runData) throwRunNotFoundError(runId);
  return runData;
};

const deleteRunById = async (runId) => {
  const result = await runsRepo.deleteRunById(runId);
  if (result.deletedCount === 0) throwRunNotFoundError(runId);
};

module.exports = {
  createRun,
  getRunById,
  getRunsByUser,
  updateRunById,
  deleteRunById,
};
