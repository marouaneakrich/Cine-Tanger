const router = require("express").Router();
const controller = require("../controllers/movie.controller");

router.get("/", controller.getAllMovies);
router.get("/:id", controller.getMovieById);

module.exports = router;
