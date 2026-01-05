const Room = require("../models/Room");

const rooms = [
  { name: "Salle 1", capacity: 50 },
  { name: "Salle 2", capacity: 60 },
];

module.exports = async () => {
  await Room.bulkCreate(rooms);
  console.log("🏛️ Rooms seeded");
};
