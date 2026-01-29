const app = require("./app");
const { connectDB } = require("./utils/db.utils.js");
const { PORT } = require("./config/env.config");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
