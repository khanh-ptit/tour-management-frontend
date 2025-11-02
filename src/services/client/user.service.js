import { del, get, patch, post } from "../../utils/request.js";
import axios from "axios";
const API_DOMAIN = "http://localhost:5000/";

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

export const toggleTwoFa = async (userId, status, captchaToken) => {
  const result = await patch(
    `${version}/user/toggle-two-fa/${userId}?status=${status}&captchaToken=${captchaToken}`
  );
  return result;
};

export const verifyVoice = (formData) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return axios
    .post(`${API_DOMAIN}api/v1/user/verify-voice`, formData, {
      headers,
    })
    .then((res) => res.data);
};
