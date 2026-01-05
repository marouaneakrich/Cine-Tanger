const { sequelize } = require("../models");
const seedMovies = require("./movies.seed");
const seedRooms = require("./rooms.seed");
const seedSessions = require("./sessions.seed");

const runSeeding = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ force: true });
    console.log("🧹 Database cleared and synced");

    await seedMovies();
    await seedRooms();
    await seedSessions();

    console.log("🌱 Database seeded successfully");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

runSeeding();