import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import Loader from "../Loader/Loader"; // Import the Loader component

const ProjectsList = ({ licenseType }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Set loading to true at the start of the fetch
      try {
        const response = await axios.get("http://127.0.0.1:8000/trending", {
          params: { license_type: licenseType, per_page: 6 },
        });
        setProjects(response.data);
      } catch (err) {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchProjects();
  }, [licenseType]);

  // Render loader when loading, error message if error exists, otherwise render projects
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.name}
          title={project.name}
          description={project.description || "No description available"}
          url={project.link}
          stars={project.stars}
          imageurl={project.image}
          license={licenseType}
          forks={project.forks}
        />
      ))}
    </div>
  );
};

export default ProjectsList;
