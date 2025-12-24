const router = require("express").Router();
const controller = require("../controllers/reservation.controller");

router.post("/", controller.createReservation);
router.get("/", controller.getAllReservations);
router.get("/:id", controller.getReservationById);
router.get("/session/:sessionId", controller.getReservationsBySession);
router.get("/customer/:customerEmail", controller.getReservationsByCustomer);
router.delete("/:id", controller.deleteReservation);

module.exports = router;
