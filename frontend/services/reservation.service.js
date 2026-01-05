import { api } from "./api";

// Mock data for testing
const mockReservations = [
  {
    id: 1,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    seatNumber: "A5",
    sessionId: 1,
    qrCode: "reservation-1-qr",
    sessionTime: new Date(Date.now() + 3600000).toISOString()
  },
  {
    id: 2,
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    seatNumber: "B3",
    sessionId: 2,
    qrCode: "reservation-2-qr",
    sessionTime: new Date(Date.now() + 7200000).toISOString()
  }
];

const mockReservedSeats = ["A1", "A2", "A3", "B1", "B2"];

export const getReservations = async () => {
  try {
    const res = await api.get("/reservations");
    return res.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const getReservationsBySession = async (sessionId) => {
  try {
    const res = await api.get(`/reservations/session/${sessionId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching reservations for session:", error);
    throw error;
  }
};

export const getReservationsByCustomer = async (customerEmail) => {
  try {
    const res = await api.get(`/reservations/customer/${customerEmail}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching reservations for customer:", error);
    throw error;
  }
};

export const getReservedSeatsBySession = async (sessionId) => {
  try {
    const res = await api.get(`/reservations/session/${sessionId}`);
    return res.data.map(r => r.seatNumber);
  } catch (error) {
    console.error("Error fetching reserved seats for session:", error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const res = await api.delete(`/reservations/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};

export const createReservation = async (data) => {
  try {
    const res = await api.post("/reservations", data);
    return res.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};
