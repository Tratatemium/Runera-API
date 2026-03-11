const app = require("../src/app.js");
const { connectDB } = require("../src/utils/db.utils.js");
const { setServerStartTime } = require("../src/utils/server.utils.js");

setServerStartTime();

let connected = false;

(async () => {
  try {
    if (!connected) {
      await connectDB();
      connected = true;
    }
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();

module.exports = app;
