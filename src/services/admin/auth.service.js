import { post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const checkLogin = async (options) => {
  const result = await post(`${prefixAdmin}auth/login`, options);
  return result;
};

export const checkAuth = async () => {
  const result = await post(`${prefixAdmin}auth/me`);
  return result;
};

export const logout = async () => {
  const result = await post(`${prefixAdmin}auth/logout`);
  return result;
};
