import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  selectedMovie: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  
  selectedSession: null,
  setSelectedSession: (session) => set({ selectedSession: session }),
  
  bookingData: {
    customerName: '',
    customerEmail: '',
    seatNumber: '',
  },
  setBookingData: (data) => set((state) => ({
    bookingData: { ...state.bookingData, ...data }
  })),
  resetBookingData: () => set({
    bookingData: {
      customerName: '',
      customerEmail: '',
      seatNumber: '',
    }
  }),
  
  resetBooking: () => set({
    selectedMovie: null,
    selectedSession: null,
    bookingData: {
      customerName: '',
      customerEmail: '',
      seatNumber: '',
    }
  }),
}));
