// BACKEND_URL=http://localhost:5000/api/v1

import envConfig from "@/config/envConfig";

export const userApi = {
  signUpApi: `${envConfig.BASE_BACKEND_URL}/users`,
  loginApi: `${envConfig.BASE_BACKEND_URL}/users/login`,
  logoutApi: `${envConfig.BASE_BACKEND_URL}/users/logout`,
  getMyProfile: `${envConfig.BASE_BACKEND_URL}/users/me`,
  getFeedData : `${envConfig.BASE_BACKEND_URL}/users/all`,
  updateProfile: `${envConfig.BASE_BACKEND_URL}/users/me`,
};
