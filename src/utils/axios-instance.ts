import envConfig from "@/config/envConfig";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: envConfig.BASE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response?.status === 401) {
      // Don't log 401 errors as they're expected when user is not authenticated
      console.log("🔐 Authentication required");
    } else if (error.response?.status >= 500) {
      console.error("🔥 Server error:", error.response.status);
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      console.error("🌐 Network error:", error.message);
    }

    // Always reject the promise so the calling code can handle it
    return Promise.reject(error);
  }
);

export default axiosInstance;
