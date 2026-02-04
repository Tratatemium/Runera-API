/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

const express = require("express");
const app = express();

/* ================================================================================================= */
/*  SERVER UPTIME                                                                                    */
/* ================================================================================================= */

const serverTimeStart = Date.now();

const getUptime = () => {
  const uptime = Date.now() - serverTimeStart;
  const uptimeSeconds = Math.floor(uptime / 1000);

  const hrs = Math.floor(uptimeSeconds / 3600);
  const mins = Math.floor((uptimeSeconds % 3600) / 60);
  const secs = uptimeSeconds % 60;

  const pad = (n) => n.toString().padStart(2, "0");

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

/* ================================================================================================= */
/*  MIDDLEWARE                                                                                       */
/* ================================================================================================= */

app.use(express.json());

/* ================================================================================================= */
/*  ROUTE IMPORTS                                                                                    */
/* ================================================================================================= */

const authRouter = require("./routes/auth.routes.js");
const usersRouter = require("./routes/users.routes.js");
const runsRouter = require("./routes/runs.routes.js");

/* ================================================================================================= */
/*  ROUTER PREFIX                                                                                    */
/* ================================================================================================= */

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: getUptime(),
    version: "1.0.0",
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/runs", runsRouter);

app.use("/api/v1", apiRouter);

/* ================================================================================================= */
/*  ERROR HANDLERS                                                                                   */
/* ================================================================================================= */

const {
  jsonSyntaxErrorHandler,
  dbErrorHandler,
  authErrorHandler,
  finalErrorHandler,
} = require("./middleware/error.middleware.js");

app.use(jsonSyntaxErrorHandler);
app.use(dbErrorHandler);
app.use(authErrorHandler);
app.use(finalErrorHandler);

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

module.exports = app;
