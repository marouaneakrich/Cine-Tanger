const express = require("express");
const cors = require("cors");

const movieRoutes = require("./routes/movie.routes");
const sessionRoutes = require("./routes/session.routes");
const reservationRoutes = require("./routes/reservation.routes");
const roomRoutes = require("./routes/room.routes");
const { apiReference } = require("@scalar/express-api-reference");
const swaggerSpec = require("../config/swagger");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://cine-tanger.up.railway.app']
}));
app.use(express.json());


app.use(
  "/api-docs",
  apiReference({
    spec: {
      content: swaggerSpec,
    },
  })
);

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/rooms", roomRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🎬 CineTanger API is running" });
});

// Error handler
app.use(errorMiddleware);

module.exports = app;
