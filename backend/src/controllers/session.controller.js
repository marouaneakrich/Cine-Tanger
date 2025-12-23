const Session = require("../../models/Session");
const Movie = require("../../models/Movie");
const Room = require("../../models/Room");

exports.getSessionsByMovie = async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      where: { MovieId: req.params.movieId },
      include: [Movie, Room],
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};
