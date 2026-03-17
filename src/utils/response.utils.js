const sendSuccess = (
  res,
  { statusCode = 200, data = null, cookie, extra = {} } = {},
) => {
  res.status(statusCode);

  if (cookie) {
    res.cookie(cookie.name, cookie.value, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
      ...cookie.options,
    });
  }

  res.json({
    status: "success",
    ...extra,
    data,
  });
};

module.exports = { sendSuccess };
