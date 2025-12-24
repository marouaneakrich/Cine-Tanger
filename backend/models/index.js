const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_URL || 'sqlite::memory:',
  {
    dialect: "postgres",
    logging: false,
  }
);

module.exports = { sequelize };
