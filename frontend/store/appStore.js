import { create } from 'zustand';

// App store for global state management
export const useAppStore = create((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Selected movie for booking
  selectedMovie: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  
  // Selected session for booking
  selectedSession: null,
  setSelectedSession: (session) => set({ selectedSession: session }),
  
  // Booking state
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
  
  // Navigation helpers
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
