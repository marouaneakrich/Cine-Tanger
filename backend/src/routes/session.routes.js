const router = require("express").Router();
const controller = require("../controllers/session.controller");

router.get("/movie/:movieId", controller.getSessionsByMovie);

module.exports = router;
