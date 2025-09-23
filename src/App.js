import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { colorPalette } from "./utils/colorPalette";
import Products from "./pages/Products";
import Item from "./pages/Item"; 
import BackgroundTexture from "./ui/BackgroundTexture";
import { Toaster } from "react-hot-toast"; // global toast container

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // ⬇️ Sync Tailwind dark mode class with state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="relative min-h-screen">
        <Toaster position="top-center\" />
   -
      {/* Gradient background (custom colorPalette) */}
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
            <Route path="/products" element={<Products darkMode={darkMode} />} />
            <Route path="/item/:id" element={<Item darkMode={darkMode} />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}