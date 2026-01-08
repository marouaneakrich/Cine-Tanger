import  { useState } from "react";
import SplashScreen from "./SplashScreen";
import MainAppComponent from "./MainAppComponent";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <MainAppComponent />;
}

export { MainAppComponent as MainApp };
