const Movie = require("../../models/Movie");
const { sequelize } = require("../../models");

exports.getAllMovies = async (req, res, next) => {
  try {
    // Get movies without rating first
    const movies = await Movie.findAll({
      order: [["createdAt", "DESC"]],
    });
    
    // Manually add rating from database
    const moviesWithRating = await Promise.all(
      movies.map(async (movie) => {
        const [ratingResult] = await sequelize.query(
          'SELECT rating FROM "Movies" WHERE id = :id',
          {
            replacements: { id: movie.id },
            type: sequelize.QueryTypes.SELECT
          }
        );
        
        return {
          ...movie.toJSON(),
          rating: ratingResult.rating
        };
      })
    );
    
    res.json(moviesWithRating);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      attributes: ['id', 'title', 'synopsis', 'posterUrl', 'duration', 'rating', 'createdAt', 'updatedAt']
    });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const { title, synopsis, posterUrl, duration, rating } = req.body;

    if (!title || !synopsis) {
      return res.status(400).json({
        message: "Title and synopsis are required",
      });
    }

    const movie = await Movie.create({
      title,
      synopsis,
      posterUrl,
      duration,
      rating: rating || 0.0,
    });

    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const { title, synopsis, posterUrl, duration, rating } = req.body;
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.update({
      title: title || movie.title,
      synopsis: synopsis || movie.synopsis,
      posterUrl: posterUrl || movie.posterUrl,
      duration: duration || movie.duration,
      rating: rating !== undefined ? rating : movie.rating,
    });

    res.json(movie);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.destroy();
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
};
