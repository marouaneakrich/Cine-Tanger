const router = require("express").Router();
const controller = require("../controllers/session.controller");

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management
 */

/**
 * @swagger
 * /sessions/movie/{movieId}:
 *   get:
 *     summary: Get sessions by movie ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: List of sessions for the movie
 *       404:
 *         description: Movie or sessions not found
 */
router.get("/movie/:movieId", controller.getSessionsByMovie);

module.exports = router;
