import axios from "axios";

// Get environment-specific base URL
const getBaseURL = () => {
  // Use environment variable if set, otherwise use development URL
  const customBaseURL = import.meta.env.VITE_API_BASE_URL;

  if (customBaseURL) {
    return customBaseURL;
  }

  // Default to development URL
  return "http://localhost:3000/api/v1";
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
    // Cookies are automatically sent with requests, but add Authorization header as fallback
    // This helps with mobile browsers and incognito mode that may have cookie issues
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
      // Handle unauthorized access - clear stored auth data
      console.error("Unauthorized access");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Redirect to home page if not already there
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
