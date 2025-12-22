import React, { createContext, useContext, useState } from "react";
import { colors } from "../constants/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColors, setThemeColors] = useState(colors);

  const toggleDarkMode = () => {
    setThemeColors((prev) =>
      prev.background === "#FFFFFF"
        ? {
            primary: "#BB86FC",
            secondary: "#03DAC6",
            background: "#121212",
            surface: "#1E1E1E",
            text: "#FFFFFF",
            error: "#CF6679",
          }
        : colors
    );
  };

  return (
    <ThemeContext.Provider value={{ colors: themeColors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
