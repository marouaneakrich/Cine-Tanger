const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Movie = sequelize.define("Movie", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  posterUrl: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.INTEGER, // minutes
  },
});

module.exports = Movie;
