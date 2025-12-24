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
  rating: {
    type: DataTypes.INTEGER, // Rating as integer (e.g., 8, 9, 10)
    defaultValue: 0,
  },
});

module.exports = Movie;
