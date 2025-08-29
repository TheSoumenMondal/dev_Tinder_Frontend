import envConfig from "@/config/envConfig";

export const connectionApi = {
  reactToUser: `${envConfig.BASE_BACKEND_URL}/connections/send`,
  getUserConnections: `${envConfig.BASE_BACKEND_URL}/connections/all`,
  updateConnectionStatus: `${envConfig.BASE_BACKEND_URL}/connections`,
  getMyRequests: `${envConfig.BASE_BACKEND_URL}/connections/requests`
};
