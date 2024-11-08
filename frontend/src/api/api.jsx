import axios from "axios";

const FASTAPI_URL = "http://127.0.0.1:8000"; // Base URL for your FastAPI backend

// Axios instance for FastAPI requests
const api = axios.create({
  baseURL: FASTAPI_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`, // Use your token if needed
  },
});

// Function to fetch trending projects based on license type
export const fetchProjects = async (licenseType = "All") => {
  try {
    const response = await api.get(`/projects?license_type=${licenseType}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // Re-throw to handle in the component
  }
};







