import { api } from "./api";

export const getReservations = async () => {
  const res = await api.get("/reservations");
  return res.data;
};

export const getReservedSeatsBySession = async (sessionId) => {
  const res = await api.get(`/reservations/session/${sessionId}/seats`);
  return res.data;
};

export const createReservation = async (data) => {
  const res = await api.post("/reservations", data);
  return res.data;
};
