const router = require("express").Router();
const controller = require("../controllers/reservation.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - customerName
 *         - customerEmail
 *         - seatNumber
 *         - confirmationCode
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the reservation
 *         customerName:
 *           type: string
 *           description: The name of the customer
 *         customerEmail:
 *           type: string
 *           description: The email of the customer
 *         seatNumber:
 *           type: string
 *           description: The seat number
 *         confirmationCode:
 *           type: string
 *           description: The confirmation code
 *         qrCode:
 *           type: string
 *           description: The QR code string
 *         SessionId:
 *           type: integer
 *           description: The ID of the session
 *       example:
 *         customerName: John Doe
 *         customerEmail: john@example.com
 *         seatNumber: A1
 *         confirmationCode: ABC123XYZ
 *         SessionId: 1
 */

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: The reservations managing API
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Returns the list of all the reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: The list of the reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: The reservation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Some server error
 */
router.post("/", controller.createReservation);
router.get("/", controller.getAllReservations);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get the reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     responses:
 *       200:
 *         description: The reservation description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: The reservation was not found
 *   delete:
 *     summary: Remove the reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     responses:
 *       200:
 *         description: The reservation was deleted
 *       404:
 *         description: The reservation was not found
 */
router.get("/:id", controller.getReservationById);

/**
 * @swagger
 * /reservations/session/{sessionId}:
 *   get:
 *     summary: Get reservations by session ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The session id
 *     responses:
 *       200:
 *         description: The list of reservations for the session
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/session/:sessionId", controller.getReservationsBySession);

/**
 * @swagger
 * /reservations/customer/{customerEmail}:
 *   get:
 *     summary: Get reservations by customer email
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: customerEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer email
 *     responses:
 *       200:
 *         description: The list of reservations for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/customer/:customerEmail", controller.getReservationsByCustomer);
router.delete("/:id", controller.deleteReservation);

module.exports = router;
