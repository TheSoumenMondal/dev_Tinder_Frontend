const envConfig = {
  BASE_BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1",
};

// Log environment configuration in development
if (process.env.NODE_ENV === "development") {
  console.log("🔧 Environment Config:", {
    BASE_BACKEND_URL: envConfig.BASE_BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}

export default envConfig;
