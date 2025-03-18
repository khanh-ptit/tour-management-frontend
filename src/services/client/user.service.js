import { del, patch, post } from "../../utils/request.js";
const version = "api/v1";

export const register = async (options) => {
  const result = await post(`${version}/user/register`, options);
  return result;
};

export const login = async (options) => {
  const result = await post(`${version}/user/login`, options);
  return result;
};

export const forgotPassword = async (options) => {
  const result = await post(`${version}/user/password/forgot`, options);
  return result;
};

export const otpPassword = async (options) => {
  const result = await post(`${version}/user/password/otp`, options);
  return result;
};

export const deleteAllOtp = async (email) => {
  const result = await del(`${version}/user/password/delete-otp/${email}`);
  return result;
};

export const resetPassword = async (data) => {
  const result = await patch(`${version}/user/password/reset`, data);
  return result;
};
