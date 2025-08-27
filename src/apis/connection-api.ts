import envConfig from "@/config/envConfig";

export const connectionApi = {
  reactToUser: `${envConfig.BASE_BACKEND_URL}/connections/send`,
  getUserConnections: `${envConfig.BASE_BACKEND_URL}/connections/requests`,
  updateConnectionStatus: `${envConfig.BASE_BACKEND_URL}/connections`,
};
