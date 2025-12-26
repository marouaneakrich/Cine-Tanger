const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use PostgreSQL database
const sequelize = new Sequelize(process.env.DB_URL || "postgresql://postgres:OYTgFgxhTUNOzeLJAgLUILuCpgsHfglT@interchange.proxy.rlwy.net:45912/railway", {
  dialect: "postgres",
  logging: false,
});

module.exports = { sequelize };
