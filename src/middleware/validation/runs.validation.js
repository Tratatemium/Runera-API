const validators = require("./validators.js");

const validateUUID = (param = "id") => {
  return (req, res, next) => {
    validators.validateUUID(req.params[param]);
    next();
  };
};

const runFields = [
  {
    key: "startTime",
    input: null,
    validate: (input) => {
      validators.assertString(input, "startTime");
      const trimmed = input.trim();
      validators.validateISO(trimmed, "startTime", "datetime");
      return trimmed;
    },
  },
  {
    key: "durationSec",
    input: null,
    validate: (input) => {
      const normalized = Number(String(input).trim());
      validators.validatePositiveNumber(normalized, "durationSec");
      validators.validateNonZero(normalized, "durationSec");
      return normalized;
    },
  },
  {
    key: "distanceMeters",
    input: null,
    validate: (input) => {
      const normalized = Number(String(input).trim());
      validators.validatePositiveNumber(normalized, "distanceMeters");
      validators.validateNonZero(normalized, "distanceMeters");
      return normalized;
    },
  },
  {
    key: "title",
    input: null,
    validate: (input) => {
      validators.assertString(input, "title");
      return input;
    },
  },
  {
    key: "notes",
    input: null,
    validate: (input) => {
      validators.assertString(input, "notes");
      return input;
    },
  },
  {
    key: "perceivedEffort",
    input: null,
    validate: (input) => {
      const normalized = Number(String(input).trim());
      validators.validatePositiveNumber(normalized, "perceivedEffort");
      validators.validatePerceivedEffort(normalized);
      return normalized;
    },
  },
  {
    key: "weather",
    input: null,
    validate: (input) => {
      validators.assertString(input, "weather");
      validators.validateWeather(input);
      return input;
    },
  },
];

const validateRun = ({ mode = "require_all" }) => {
  return (req, res, next) => {
    validators.validateJsonContentType(req);

    validators.assertRequestFields({
      object: req.body,
      objectName: "Run data",
      requiredFields: ["startTime", "durationSec", "distanceMeters"],
      allowedFields: ["title", "notes", "perceivedEffort", "weather"],
      mode: mode,
    });

    const boundRunFields = runFields.map((field) => ({
      ...field,
      input: req.body[field.key],
    }));

    const runData = Object.fromEntries(
      boundRunFields
        .filter((field) => field.input != null)
        .map((field) => [field.key, field.validate(field.input)]),
    );

    req.runData = runData;
    next();
  };
};

module.exports = { validateUUID, validateRun };
