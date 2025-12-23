const Movie = require("../models/Movie");

const movies = [
  {
    title: "Oppenheimer",
    synopsis: "The story of J. Robert Oppenheimer and the atomic bomb.",
    posterUrl: "https://image.tmdb.org/t/p/w500/oppenheimer.jpg",
    duration: 180,
  },
  {
    title: "The Batman",
    synopsis: "Batman fights crime in Gotham City.",
    posterUrl: "https://image.tmdb.org/t/p/w500/batman.jpg",
    duration: 175,
  },
];

module.exports = async () => {
  await Movie.bulkCreate(movies);
  console.log("🎬 Movies seeded");
};
