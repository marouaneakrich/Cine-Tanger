import React from "react";
import AppNavigator from "./src/navigation";
import { AppProvider } from "./src/context/AppProvider";

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
