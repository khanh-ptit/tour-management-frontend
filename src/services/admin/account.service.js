import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getAccountList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${prefixAdmin}accounts?${queryString}`);
  return result;
};

export const deleteAccount = async (id) => {
  const result = await del(`${prefixAdmin}accounts/delete/${id}`);
  return result;
};

export const createAccount = async (data) => {
  const result = await post(`${prefixAdmin}accounts/create`, data);
  return result;
};

export const editAccount = async (id, data) => {
  const result = await patch(`${prefixAdmin}accounts/edit/${id}`, data);
  return result;
};
