const serverless = require("serverless-http");
const app = require("../src/app.js");
const { connectDB } = require("../src/utils/db.utils.js");

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    // Ensure DB is connected before handling request
    await connectDB();
    console.log("Mongoose readyState:", require("mongoose").connection.readyState);

    // **Await the Express handler** to prevent early termination
    await handler(req, res);
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
};
