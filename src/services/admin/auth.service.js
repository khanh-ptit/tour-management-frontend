import { post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const checkLogin = async (options) => {
  const result = await post(`${prefixAdmin}auth/login`, options);
  return result;
};
