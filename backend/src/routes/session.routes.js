const router = require("express").Router();
const controller = require("../controllers/session.controller");

router.get("/", controller.getAllSessions);
router.get("/movie/:movieId", controller.getSessionsByMovie);
router.get("/:id", controller.getSessionById);
router.post("/", controller.createSession);
router.put("/:id", controller.updateSession);
router.delete("/:id", controller.deleteSession);

module.exports = router;
