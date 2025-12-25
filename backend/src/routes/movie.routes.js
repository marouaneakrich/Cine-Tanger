const router = require("express").Router();
const controller = require("../controllers/movie.controller");

router.get("/", controller.getAllMovies);
router.get("/:id", controller.getMovieById);
router.post("/", controller.createMovie);
router.put("/:id", controller.updateMovie);
router.delete("/:id", controller.deleteMovie);

module.exports = router;