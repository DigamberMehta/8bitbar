import axios from "axios";

// Get environment-specific base URL
const getBaseURL = () => {
  const environment = import.meta.env.VITE_SQUARE_ENVIRONMENT || "sandbox";
  const isProduction = environment === "production";

  // Use environment variable if set, otherwise use default based on environment
  const customBaseURL = import.meta.env.VITE_API_BASE_URL;

  if (customBaseURL) {
    return customBaseURL;
  }

  // Default URLs based on environment
  return isProduction
    ? "https://https://8bitbar.com.au.com/api/v1" // Production URL
    : "http://localhost:3000/api/v1"; // Development URL
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
