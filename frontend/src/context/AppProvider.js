import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { FilmsProvider } from "./FilmsContext";
import { BookingProvider } from "./BookingContext";
import { OfflineProvider } from "./OfflineContext";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <FilmsProvider>
        <BookingProvider>
          <OfflineProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </OfflineProvider>
        </BookingProvider>
      </FilmsProvider>
    </AuthProvider>
  );
};
