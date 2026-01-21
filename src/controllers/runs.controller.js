// runs.controller.js

const {
  validateUUID,
  parseAndValidateRun,
} = require("../validation/validation.js");
const { findRunByID, addNewRun } = require("../database.js");

const getRunByID = async (req, res) => {
  validateUUID(req.params.id, "runID");
  const data = await findRunByID(req.params.id);
  res.json(data);
};

const postNewRun = async (req, res) => {
  const newRun = parseAndValidateRun(req);
  const newRunID = await addNewRun(newRun);
  res.status(201).json({ id: newRunID });
};

module.exports = { getRunByID, postNewRun };
