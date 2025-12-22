import fs from 'fs';
import path from 'path';
import process from 'process';
import { Sequelize, DataTypes } from 'sequelize';
import configJson from '../config/config.json' assert { type: 'json' };

const basename = path.basename(import.meta.url);
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(import.meta.url) &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(async file => {
    const modelImport = await import(path.join(__dirname, file));
    const model = modelImport.default(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
