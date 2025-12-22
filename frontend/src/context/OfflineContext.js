import React, { createContext, useContext, useState } from "react";

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);

  return (
    <OfflineContext.Provider value={{ queue, setQueue }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
