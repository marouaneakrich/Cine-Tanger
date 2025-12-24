const router = require("express").Router();
const controller = require("../controllers/movie.controller");

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   synopsis:
 *                     type: string
 *                   posterUrl:
 *                     type: string
 *                   duration:
 *                     type: integer
 *                   rating:
 *                     type: number
 *                     format: float
 *       500:
 *         description: Server error
 */
router.get("/", controller.getAllMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 synopsis:
 *                   type: string
 *                 posterUrl:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 rating:
 *                   type: number
 *                   format: float
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get("/:id", controller.getMovieById);

module.exports = router;
