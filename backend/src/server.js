require("dotenv").config();
const app = require("./app");
const { sequelize } = require("../models");

const PORT = process.env.PORT || 80;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("📦 Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error);
  }
};

startServer();
