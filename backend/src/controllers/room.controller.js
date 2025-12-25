const Room = require("../../models/Room");

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      order: [["name", "ASC"]],
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({
        message: "Name and capacity are required",
      });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be a positive number",
      });
    }

    const room = await Room.create({
      name,
      capacity,
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { name, capacity } = req.body;
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (capacity !== undefined && capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be a positive number",
      });
    }

    await room.update({
      name: name || room.name,
      capacity: capacity !== undefined ? capacity : room.capacity,
    });

    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await room.destroy();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};