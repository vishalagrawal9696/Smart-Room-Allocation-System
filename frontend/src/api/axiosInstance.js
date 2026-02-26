import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED" ? "Request timed out" : "Network error. Please try again.");

    // Show toast for non-validation errors (validation shown inline)
    if (error.response?.status !== 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
