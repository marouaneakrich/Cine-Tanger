import express from "express";
import cors from "cors";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "./config/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const env = process.env.NODE_ENV;
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: dbConfig.logging,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

testConnection();
