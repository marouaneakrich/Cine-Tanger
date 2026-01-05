const Session = require("../models/Session");
const Movie = require("../models/Movie");
const Room = require("../models/Room");

module.exports = async () => {
  const movie = await Movie.findOne();
  const room = await Room.findOne();

  await Session.bulkCreate([
    {
      startTime: new Date(Date.now() + 3600 * 1000),
      MovieId: movie.id,
      RoomId: room.id,
    },
    {
      startTime: new Date(Date.now() + 7200 * 1000),
      MovieId: movie.id,
      RoomId: room.id,
    },
  ]);

  console.log("⏰ Sessions seeded");
};
