import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMovies, getMovieById } from '../services/movie.service';
import { getReservations, deleteReservation, createReservation } from '../services/reservation.service';
import { getSessionsByMovie } from '../services/session.service';

// Query keys
export const queryKeys = {
  movies: ['movies'],
  movie: (id) => ['movie', id],
  reservations: ['reservations'],
  sessions: (movieId) => ['sessions', movieId],
};

// Movies queries
export const useMovies = () => {
  return useQuery({
    queryKey: queryKeys.movies,
    queryFn: getMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMovie = (id) => {
  return useQuery({
    queryKey: queryKeys.movie(id),
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
};

// Sessions queries
export const useSessions = (movieId) => {
  return useQuery({
    queryKey: queryKeys.sessions(movieId),
    queryFn: () => getSessionsByMovie(movieId),
    enabled: !!movieId,
  });
};

// Reservations queries
export const useReservations = () => {
  return useQuery({
    queryKey: queryKeys.reservations,
    queryFn: getReservations,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Reservations mutations
export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
    },
  });
};
