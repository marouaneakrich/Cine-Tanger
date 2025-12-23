const router = require("express").Router();
const controller = require("../controllers/reservation.controller");

router.post("/", controller.createReservation);
router.get("/", controller.getReservations);

module.exports = router;
