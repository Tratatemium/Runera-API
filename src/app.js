/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

/* ================================================================================================= */
/*  MIDDLEWARE                                                                                       */
/* ================================================================================================= */

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = ["https://localhost:3000", "https://runera.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/* ================================================================================================= */
/*  VERCEL                                                                                     */
/* ================================================================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    service: "runners-api",
    status: "running",
  });
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

/* ================================================================================================= */
/*  ROUTER IMPORTS                                                                                   */
/* ================================================================================================= */

const healthRouter = require("./routers/health.router.js");
const authRouter = require("./routers/auth.router.js");
const usersRouter = require("./routers/users.router.js");
const runsRouter = require("./routers/runs.router.js");

/* ================================================================================================= */
/*  API ROUTERS (VERSIONED)                                                                          */
/* ================================================================================================= */

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/runs", runsRouter);

app.use("/health", healthRouter);
app.use("/api/v1", v1Router);

/* ================================================================================================= */
/*  ERROR HANDLERS                                                                                   */
/* ================================================================================================= */

const { apiErrorHandler } = require("./middleware/error.middleware.js");

app.use(apiErrorHandler);

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

module.exports = app;
