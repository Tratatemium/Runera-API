/* ================================================================================================= */
/*  HELPER FUNCTIONS                                                                                 */
/* ================================================================================================= */

const throwValidationError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

/* ================================================================================================= */
/*  VALIDATE FUNCTIONS                                                                               */
/* ================================================================================================= */

const validateJsonContentType = (req) => {
  if (!req.is("json")) {
    throwValidationError("Content-Type must be json.", 415);
  }
};

const assertRequestFields = (req, requiredFields, objectName = "Request body") => {
  if (typeof req.body !== "object" || req.body === null) {
    throwValidationError(`${objectName} must be an object`)
  }

  const missingFields = requiredFields.filter(
    (field) => req.body[field] === undefined || req.body[field] === null
  );
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    throwValidationError(`${objectName} is missing required fields: ${missingFieldsString}.`)
  }
}

const validateUUID = (ID, IDname = "ID") => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(ID);
  if (!isUUID) {
    throwValidationError(`${IDname} must be a valid UUID.`);
  }
};

const validateISODate = (timestamp, timestampName) => {
  if (typeof timestamp !== "string") {
    throwValidationError(
      `${timestampName} must be a string in ISO 8601 format.`,
    );
  }

  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

  if (!isoRegex.test(timestamp)) {
    throwValidationError(
      `${timestampName} must be a valid date in the ISO 8601 format.`,
    );
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throwValidationError(
      `${timestampName} must be a valid date in the ISO 8601 format.`,
    );
  }
};


/* ================================================================================================= */
/*  RUN DATA VALIDATION                                                                              */
/* ================================================================================================= */

const validateRunFields = ({
  userId,
  startTime,
  durationSec,
  distanceMeters,
}) => {

  validateUUID(userId, "userId");
  validateISODate(startTime, "startTime");

  const durationNormalized = Number(durationSec);
  const distanceNormalized = Number(distanceMeters);

  if (isNaN(durationNormalized) || durationNormalized <= 0) {
    const err = new Error("durationSec must be a positive number.");
    err.status = 400;
    throw err;
  }

  if (isNaN(distanceNormalized) || distanceNormalized <= 0) {
    const err = new Error("distanceMeters must be a positive number.");
    err.status = 400;
    throw err;
  }

  return {
    userId,
    startTime,
    durationSec: durationNormalized,
    distanceMeters: distanceNormalized,
  };
};

const parseAndValidateRun = (req) => {
  validateJsonContentType(req);

  assertRequestFields(
    req,
    [ "userId",  "startTime",  "durationSec",  "distanceMeters" ],
    "Run data"
  )

  const { userId, startTime, durationSec, distanceMeters } = req.body;
  const runData = validateRunFields({
    userId,
    startTime,
    durationSec,
    distanceMeters,
  });
  return runData;
};

/* ================================================================================================= */
/*  USER DATA VALIDATION                                                                             */
/* ================================================================================================= */

const validateUserFields = ({ username, password, email }) => {
  isUsernameValid(username);
  isUsernameUnique(username);

  isEmailValid(email);
  isEmailUnique(email);

  isPasswordValid(password);

  const validated = {
    username,
    email,
  };

  return { userData: validated, plainTextPassword: password };
};

const parseAndValidateUser = (req) => {
  validateJsonContentType(req);

  const { username, password, email } = req.body;

  const { userData, plainTextPassword } = validateUserFields({
    username,
    password,
    email,
  });

  return { userData, plainTextPassword };
};

// const validateUserFields = ({
//   username,
//   password,
//   email,
//   firstName,
//   lastName,
//   dateOfBirth,
//   heightCm,
//   weightKg,
// }) => {
//   // To be implemented

//   const validated = {
//     username,
//     email,
//     profile: {
//       firstName,
//       lastName,
//       dateOfBirth,
//       heightCm,
//       weightKg,
//     }
//   };

//   return { userData: validated, plainTextPassword: password };
// };

// const parseAndValidateUser = (req) => {
//   validateJsonContentType(req);

//   const { username, password, email, profile } = req.body;
//   const { firstName, lastName, dateOfBirth, heightCm, weightKg } = profile;

//   const { userData, plainTextPassword } = validateUserFields({
//     username,
//     password,
//     email,
//     firstName,
//     lastName,
//     dateOfBirth,
//     heightCm,
//     weightKg,
//   });
//   return { userData, plainTextPassword };
// };

//  "profile": {
//      "firstName": "Alex",
//      "lastName": "Miller",
//      "dateOfBirth": "1995-06-18",
//      "heightCm": 178,
//      "weightKg": 72
//    }

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

module.exports = {
  validateUUID,
  validateISODate,
  parseAndValidateRun,
  parseAndValidateUser,
};
