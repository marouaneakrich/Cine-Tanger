import { api } from "./api";

// Mock data for testing
const mockSessions = [
  {
    id: 1,
    startTime: new Date(Date.now() + 3600000).toISOString(),
    MovieId: 1,
    Movie: {
      id: 1,
      title: "Inception",
      duration: 150
    },
    Room: {
      id: 1,
      name: "Room 1",
      capacity: 50
    }
  },
  {
    id: 2,
    startTime: new Date(Date.now() + 7200000).toISOString(),
    MovieId: 1,
    Movie: {
      id: 1,
      title: "Inception",
      duration: 150
    },
    Room: {
      id: 2,
      name: "Room 2",
      capacity: 30
    }
  },
  {
    id: 3,
    startTime: new Date(Date.now() + 10800000).toISOString(),
    MovieId: 1,
    Movie: {
      id: 1,
      title: "Inception",
      duration: 150
    },
    Room: {
      id: 1,
      name: "Room 1",
      capacity: 50
    }
  }
];

export const getSessions = async () => {
  try {
    const res = await api.get("/sessions");
    return res.data;
  } catch (error) {
    console.warn("Using mock sessions data due to API error:", error.message);
    return mockSessions;
  }
};

export const getSessionById = async (id) => {
  try {
    const res = await api.get(`/sessions/${id}`);
    return res.data;
  } catch (error) {
    console.warn("Using mock session data due to API error:", error.message);
    return mockSessions.find(session => session.id === parseInt(id));
  }
};

export const getSessionsByMovie = async (movieId) => {
  try {
    const res = await api.get(`/sessions/movie/${movieId}`);
    return res.data;
  } catch (error) {
    console.warn("Using mock sessions data due to API error:", error.message);
    return mockSessions.filter(session => session.MovieId === movieId);
  }
};
