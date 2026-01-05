const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");
const Movie = require("./Movie");
const Room = require("./Room");

const Session = sequelize.define("Session", {
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Movie.hasMany(Session);
Session.belongsTo(Movie);

Room.hasMany(Session);
Session.belongsTo(Room);

module.exports = Session;
