import { api } from "./api";

// Mock data for testing
const mockMovies = [
  {
    id: 1,
    title: "Inception",
    synopsis: "A skilled thief is offered a chance to have his criminal history erased as payment for the implantation of another person's idea into a target's subconscious.",
    posterUrl: "https://picsum.photos/seed/inception/300/450.jpg"
  },
  {
    id: 2,
    title: "The Dark Knight",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    posterUrl: "https://picsum.photos/seed/darkknight/300/450.jpg"
  },
  {
    id: 3,
    title: "Interstellar",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://picsum.photos/seed/interstellar/300/450.jpg"
  },
  {
    id: 4,
    title: "Dune",
    synopsis: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    posterUrl: "https://picsum.photos/seed/dune/300/450.jpg"
  }
];

const mockSessions = [
  {
    id: 1,
    startTime: new Date(Date.now() + 3600000).toISOString(),
    movieId: 1
  },
  {
    id: 2,
    startTime: new Date(Date.now() + 7200000).toISOString(),
    movieId: 1
  },
  {
    id: 3,
    startTime: new Date(Date.now() + 10800000).toISOString(),
    movieId: 1
  }
];

export const getMovies = async () => {
  try {
    const res = await api.get("/movies");
    return res.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const getMovieById = async (id) => {
  try {
    const res = await api.get(`/movies/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

export const getSessionsByMovie = async (movieId) => {
  try {
    const res = await api.get(`/sessions/movie/${movieId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching sessions for movie:", error);
    throw error;
  }
};
