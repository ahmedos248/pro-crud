import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { colorPalette } from "./utils/colorPalette";
import Products from "./pages/Products";
import BackgroundTexture from "./ui/BackgroundTexture";


export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div
        className={`absolute inset-0 -z-20 transition-colors duration-500 
          ${darkMode ? colorPalette.dark.gradient : colorPalette.light.gradient}`}
      />

      {/* Texture layer */}
      <BackgroundTexture darkMode={darkMode} />

      {/* App content */}
      <div
        className={`relative z-10 min-h-screen transition-colors duration-500 
          ${darkMode ? colorPalette.dark.text : colorPalette.light.text}`}
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="p-4 py-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
