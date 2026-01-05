const { Sequelize } = require("sequelize");
require("dotenv").config();

// Check environment
const isTest = process.env.NODE_ENV === 'test';

// Use SQLite for testing, PostgreSQL for others
const sequelize = isTest
  ? new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  })
  : new Sequelize(process.env.DB_URL || "postgresql://postgres:OYTgFgxhTUNOzeLJAgLUILuCpgsHfglT@interchange.proxy.rlwy.net:45912/railway", {
    dialect: "postgres",
    logging: false,
  });

module.exports = { sequelize };
