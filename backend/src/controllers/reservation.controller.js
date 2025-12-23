const Reservation = require("../../models/Reservation");
const { generateCode } = require("../utils/generateCode");
const { generateQRCode } = require("../utils/generateQRCode");

exports.createReservation = async (req, res, next) => {
  try {
    const { customerName, customerEmail, seatNumber, sessionId } = req.body;

    // Basic validation
    if (!customerName || !customerEmail || !seatNumber || !sessionId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if seat already reserved for this session
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
    const qrCode = generateQRCode(confirmationCode);

    const reservation = await Reservation.create({
      customerName,
      customerEmail,
      seatNumber,
      confirmationCode,
      qrCode,
      SessionId: sessionId,
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

exports.getReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};
