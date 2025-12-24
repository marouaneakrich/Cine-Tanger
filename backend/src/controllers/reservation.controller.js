const Reservation = require("../../models/Reservation");
const Session = require("../../models/Session");
const { generateCode } = require("../utils/generateCode");
const { generateQRCode } = require("../utils/generateQRCode");

exports.createReservation = async (req, res, next) => {
  try {
    const { customerName, customerEmail, seatNumber, sessionId } = req.body;

    if (!customerName || !customerEmail || !seatNumber || !sessionId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!customerEmail.includes("@")) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const existingReservation = await Reservation.findOne({
      where: {
        SessionId: sessionId,
        seatNumber: seatNumber,
      },
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "Seat already reserved for this session",
      });
    }

    const confirmationCode = generateCode();
    const qrCode = await generateQRCode(confirmationCode);

    const reservation = await Reservation.create({
      customerName,
      customerEmail,
      seatNumber,
      confirmationCode,
      qrCode,
      SessionId: sessionId,
    });

    const reservationWithSession = await Reservation.findByPk(reservation.id, {
      include: [Session],
    });

    res.status(201).json(reservationWithSession);
  } catch (error) {
    console.error('Error in createReservation:', error);
    next(error);
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.findAll({
      include: [Session],
      order: [["createdAt", "DESC"]],
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [Session],
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

exports.getReservationsBySession = async (req, res, next) => {
  try {
    const reservations = await Reservation.findAll({
      where: { SessionId: req.params.sessionId },
      include: [Session],
      order: [["seatNumber", "ASC"]],
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

exports.getReservationsByCustomer = async (req, res, next) => {
  try {
    const { customerEmail } = req.params;

    const reservations = await Reservation.findAll({
      where: { customerEmail },
      include: [Session],
      order: [["createdAt", "DESC"]],
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await reservation.destroy();
    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    next(error);
  }
};
