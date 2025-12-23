const seedMovies = require("./movies.seed");
const seedRooms = require("./rooms.seed");
const seedSessions = require("./sessions.seed");
const seedUsers = async ()=>{
  await seedMovies();
  await seedRooms();
  await seedSessions();
  
}
seedUsers()