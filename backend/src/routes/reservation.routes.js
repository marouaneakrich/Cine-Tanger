const router = require("express").Router();
const controller = require("../controllers/reservation.controller");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - seatNumber
 *               - SessionId
 *             properties:
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *                 format: email
 *               seatNumber:
 *                 type: string
 *               SessionId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.post("/", controller.createReservation);
router.get("/", controller.getReservations);

module.exports = router;
