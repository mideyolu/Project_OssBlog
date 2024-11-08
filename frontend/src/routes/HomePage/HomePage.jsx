import { useEffect, useState, useRef } from "react";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import ProjectsList from "../../components/ProjectCard/ProjectList";


const HomePage = () => {
  const navigate = useNavigate();

  // Function to navigate to the projects page
  const getNavigate = () => {
    navigate("/projects"); // Navigate to the projects route
  };

  // Create a reference to the "Top Trending Open Source Projects" section
  const trendingSectionRef = useRef(null); // Create a ref to access the trending section

  // Function to scroll to the "Top Trending Open Source Projects" section
  const scrollToTrendingSection = () => {
    if (trendingSectionRef.current) {
      trendingSectionRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
    }
  };
  const [projects, setProjects] = useState([]);
  const [licenseType, setLicenseType] = useState("mit"); // Default license type

  return (
    <div className="flex gap-[2rem] flex-col dark:text-white">
      {" "}
      {/* Main container for the homepage */}
      <div className="flex flex-2 items-center flex-col justify-center h-[100vh]">
        {" "}
        {/* Hero section */}
        <div className="text-center">
          <h2 className="text-[1.1rem] font-bold md:text-[2rem]">
            {" "}
            {/* Title of the page */}
            Explore a Curated Directory Containing
            <span className="block">Open Source Projects</span>
            Across Various Categories
          </h2>
        </div>
        <div className="flex items-center justify-center text-center w-[40%] gap-[0.2rem] mt-[2rem]">
          {" "}
          {/* Buttons container */}
          <Button onClick={scrollToTrendingSection}>
            {" "}
            {/* Button to scroll to trending section */}
            <h5>Trending</h5>
          </Button>
          <Button onClick={getNavigate}>
            {" "}
            {/* Button to navigate to projects page */}
            <h5>More</h5>
          </Button>
        </div>
      </div>
      {/* Top Trending Section */}
      <div ref={trendingSectionRef} className="px-[1.2rem]">
        {" "}
        {/* Section for trending projects */}
        <h3 className="text-center mt-[3rem] mb-[2rem] text-[1.1rem] font-bold md:text-[2rem]">
          {" "}
          {/* Section title */}
          Top Trending Open Source Projects
        </h3>
        {/* License Type Selection */}
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select License Type:</label>
          <select
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value)}
            className="p-2 border rounded cursor-pointer dark:text-black"
          >
            <option value="mit">MIT</option>
            <option value="apache-2.0">Apache 2.0</option>
            <option value="gpl-3.0">GPL 3.0</option>
            <option value="bsd-2-clause">BSD 2-Clause</option>
            <option value="bsd-3-clause">BSD 3-Clause</option>
            <option value="cc0-1.0">CC0 1.0 Universal (Public Domain)</option>
            <option value="epl-2.0">Eclipse Public License 2.0</option>
            <option value="lgpl-2.1">LGPL 2.1</option>
            <option value="lgpl-3.0">LGPL 3.0</option>
            <option value="mpl-2.0">Mozilla Public License 2.0</option>
            <option value="unlicense">The Unlicense</option>
          </select>
        </div>
        <ProjectsList licenseType={licenseType} />
      </div>
    </div>
  );
};

export default HomePage;
