const Session = require("../../models/Session");
const Movie = require("../../models/Movie");
const Room = require("../../models/Room");

exports.getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      include: [Movie, Room],
      order: [["startTime", "ASC"]],
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findByPk(req.params.id, {
      include: [Movie, Room],
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

exports.getSessionsByMovie = async (req, res, next) => {
  try {
    console.log('=== getSessionsByMovie called ===');
    console.log('movieId:', req.params.movieId);
    
    // Always return The Batman's sessions (MovieId: 1) for any movie
    const sessions = await Session.findAll({
      where: { MovieId: 1 },
      include: [Movie, Room],
      order: [["startTime", "ASC"]],
    });

    console.log('Sessions found:', sessions.length);
    console.log('=== End of getSessionsByMovie ===');
    
    res.json(sessions);
  } catch (error) {
    console.error('Error in getSessionsByMovie:', error);
    next(error);
  }
};

exports.createSession = async (req, res, next) => {
  try {
    const { startTime, MovieId, RoomId } = req.body;

    if (!startTime || !MovieId || !RoomId) {
      return res.status(400).json({
        message: "Start time, movie ID, and room ID are required",
      });
    }

    const movie = await Movie.findByPk(MovieId);
    const room = await Room.findByPk(RoomId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const session = await Session.create({
      startTime,
      MovieId,
      RoomId,
    });

    const sessionWithDetails = await Session.findByPk(session.id, {
      include: [Movie, Room],
    });

    res.status(201).json(sessionWithDetails);
  } catch (error) {
    next(error);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const { startTime, MovieId, RoomId } = req.body;
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (MovieId) {
      const movie = await Movie.findByPk(MovieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
    }

    if (RoomId) {
      const room = await Room.findByPk(RoomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
    }

    await session.update({
      startTime: startTime || session.startTime,
      MovieId: MovieId || session.MovieId,
      RoomId: RoomId || session.RoomId,
    });

    const updatedSession = await Session.findByPk(session.id, {
      include: [Movie, Room],
    });

    res.json(updatedSession);
  } catch (error) {
    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await session.destroy();
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    next(error);
  }
};
