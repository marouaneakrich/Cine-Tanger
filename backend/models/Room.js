const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Room = sequelize.define("Room", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Room;
