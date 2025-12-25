const router = require("express").Router();
const controller = require("../controllers/room.controller");

router.get("/", controller.getAllRooms);
router.get("/:id", controller.getRoomById);
router.post("/", controller.createRoom);
router.put("/:id", controller.updateRoom);
router.delete("/:id", controller.deleteRoom);

module.exports = router;