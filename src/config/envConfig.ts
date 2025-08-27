const envConfig = {
  BASE_BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1",
};

export default envConfig;
