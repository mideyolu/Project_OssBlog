import { useState, useEffect } from "react";
import "./App.css";
import HomePage from "./routes/HomePage/HomePage";
import ProjectPage from "./routes/ProjectPage/ProjectPage";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check localStorage for a saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    if (savedTheme === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
    }
  };

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
