const sendSuccess = (
  res,
  { statusCode = 200, data = null, cookie, extra = {} } = {},
) => {
  res.status(statusCode);

  if (cookie) {
    res.cookie(cookie.name, cookie.value, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
      maxAge: 1000 * 60 * 60,
      ...cookie.options,
    });
  }

  res.json({
    status: "success",
    ...extra,
    data,
  });
};

const sendError = (res, err, extra = {}) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const name = err.name || "Error";

  const errorResponse = { message, name, ...extra };

  if (err.field) {
    errorResponse.field = err.field;
  }
  res.status(status).json({ error: errorResponse });
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { sendSuccess, sendError, capitalize };
