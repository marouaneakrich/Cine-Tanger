const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");
const Session = require("./Session");

const Reservation = sequelize.define("Reservation", {
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confirmationCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qrCode: {
    type: DataTypes.TEXT,
  },
});

Session.hasMany(Reservation);
Reservation.belongsTo(Session);

module.exports = Reservation;
