import { del, get, patch, post } from "../../utils/request.js";
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

export const deleteAllVerifyOtp = async (email) => {
  const result = await del(`${version}/user/verify/delete-otp/${email}`);
  return result;
};

export const resendVerifyOtp = async (email) => {
  const result = await post(`${version}/user/verify/resend-otp`, email);
  return result;
};

export const verifyUser = async (data) => {
  const result = await post(`${version}/user/verify`, data);
  return result;
};

export const resetPassword = async (data) => {
  const result = await patch(`${version}/user/password/reset`, data);
  return result;
};

export const getProfile = async () => {
  const result = await get(`${version}/user/profile`);
  return result;
};

export const getOrderStatistic = async () => {
  const result = await get(`${version}/user/order-statistic`);
  return result;
};

export const changePasswordUser = async (data) => {
  const result = await patch(`${version}/user/change-password`, data);
  return result;
};

export const editInfoUser = async (data) => {
  const result = await patch(`${version}/user/edit-info`, data);
  return result;
};
