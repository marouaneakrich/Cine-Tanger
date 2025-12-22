import React, { createContext, useContext, useState } from "react";

const FilmsContext = createContext();

export const FilmsProvider = ({ children }) => {
  const [films, setFilms] = useState([]);

  return (
    <FilmsContext.Provider value={{ films, setFilms }}>
      {children}
    </FilmsContext.Provider>
  );
};

export const useFilms = () => useContext(FilmsContext);
