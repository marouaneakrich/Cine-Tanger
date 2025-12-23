import { api } from "./api";

export const getMovies = async () => {
  const res = await api.get("/movies");
  return res.data;
};

export const getMovieById = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};

export const getSessionsByMovie = async (movieId) => {
  const res = await api.get(`/sessions/movie/${movieId}`);
  return res.data;
};
