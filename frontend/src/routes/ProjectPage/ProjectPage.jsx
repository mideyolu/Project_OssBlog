import React, { useState, useEffect } from "react";
import { fetchProjects } from "../../api/api"; // Ensure this path is correct
import Loader from "../../components/Loader/Loader";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const ProjectPage = () => {
  const [projects, setProjects] = useState(["mit"]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedLicense, setSelectedLicense] = useState("All");
  const [languages, setLanguages] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const projectsPerPage = 12; // Number of projects per page

  const menu = (prev) => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const data = await fetchProjects();
        setProjects(data);
        setFilteredProjects(data);
        setLanguages([
          "All",
          ...new Set(data.map((project) => project.language).filter(Boolean)),
        ]);
        setLicenses([
          "All",
          ...new Set(data.map((project) => project.license).filter(Boolean)),
        ]);
      } catch (err) {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, selectedLanguage, selectedLicense);
  };

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    applyFilters(searchQuery, language, selectedLicense);
  };

  const handleLicenseChange = (event) => {
    const license = event.target.value;
    setSelectedLicense(license);
    applyFilters(searchQuery, selectedLanguage, license);
  };

  const applyFilters = (query, language, license) => {
    const filtered = projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(query);
      const matchesLanguage =
        language === "All" || project.language === language;
      const matchesLicense = license === "All" || project.license === license;
      return matchesSearch && matchesLanguage && matchesLicense;
    });

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get projects to display based on the current page
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="px-[1rem] mt-[3rem]">
      <div className="grid grid-cols-1 gap-[2rem] place-content-between items-center justify- w-2/4 md:w-1/4">
        <div className="">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects..."
          />
        </div>

        {/* License Filter as Radio Buttons */}
        <div className="">
          <span
            className="flex items-center w-[70%]  space-x-2 gap-4 cursor-pointer"
            onClick={menu}
          >
            Select a License
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
          <div
            className={`${
              open
                ? "opacity-100 max-h-[700px] max-w-[800px] z-90"
                : "opacity-0 max-h-0"
            } overflow-hidden transition-all duration-300 ease-out shadow-md py-2`}
          >
            {licenses.map((license, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="license"
                  value={license}
                  checked={selectedLicense === license}
                  onChange={handleLicenseChange}
                  className="rounded"
                  onClick={()=> setOpen(false)}
                />
                {license}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Display Loader, No Results, or Project Grid */}
      {loading ? (
        <Loader />
      ) : filteredProjects.length === 0 ? (
        <div className="text-center text-xl text-gray-600">
          Search item not found
        </div>
      ) : (
        <div className="duration-200 transition-all ease-linear mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentProjects.map((project) => (
            <ProjectCard
              imageurl={project.image}
              key={project.name}
              title={project.name}
              stars={project.stars}
              lang={project.language}
              forks={project.forks}
              issues={project.open_issues}
              description={project.description}
              url={project.link}
              license={project.license}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-[0.6rem] cursor-pointer hover:scale-105 py-[0.8rem] font-semibold bg-white mx-2 border  rounded-md transition duration-200 text-2rem lg:text-[1.3rem] md:text-[1rem] dark:text-black"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-[0.6rem] cursor-pointer hover:scale-105 py-[0.8rem] font-semibold bg-white mx-2 border  rounded-md transition duration-200 text-2rem lg:text-[1.3rem] md:text-[1rem] dark:text-black"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;
