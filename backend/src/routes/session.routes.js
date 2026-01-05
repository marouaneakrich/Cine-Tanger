const router = require("express").Router();
const controller = require("../controllers/session.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - startTime
 *         - MovieId
 *         - RoomId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the session
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the session
 *         MovieId:
 *           type: integer
 *           description: The ID of the movie shown in this session
 *         RoomId:
 *           type: integer
 *           description: The ID of the room where the session is held
 *       example:
 *         startTime: 2023-12-25T20:00:00.000Z
 *         MovieId: 1
 *         RoomId: 2
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: The sessions managing API
 */

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Returns the list of all the sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: The list of the sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       201:
 *         description: The session was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       500:
 *         description: Some server error
 */
router.get("/", controller.getAllSessions);
router.post("/", controller.createSession);

/**
 * @swagger
 * /sessions/movie/{movieId}:
 *   get:
 *     summary: Get sessions by movie ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The list of sessions for the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       404:
 *         description: No sessions found
 */
router.get("/movie/:movieId", controller.getSessionsByMovie);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get the session by id
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The session id
 *     responses:
 *       200:
 *         description: The session description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       404:
 *         description: The session was not found
 *   put:
 *     summary: Update the session by the id
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The session id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       200:
 *         description: The session was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       404:
 *         description: The session was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the session by id
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The session id
 *     responses:
 *       200:
 *         description: The session was deleted
 *       404:
 *         description: The session was not found
 */
router.get("/:id", controller.getSessionById);
router.put("/:id", controller.updateSession);
router.delete("/:id", controller.deleteSession);

module.exports = router;
