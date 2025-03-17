import { post } from "../../utils/request.js";
const version = "api/v1";

export const register = async (options) => {
  const result = await post(`${version}/user/register`, options);
  return result;
};

export const login = async (options) => {
  const result = await post(`${version}/user/login`, options);
  return result;
};
