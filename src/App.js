import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6 py-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </main>
    </div>
  );
}
