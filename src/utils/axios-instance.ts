import envConfig from "@/config/envConfig";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: envConfig.BASE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔐 Authentication required");
    } else if (error.response?.status >= 500) {
      console.error("🔥 Server error:", error.response.status);
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      console.error("🌐 Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
