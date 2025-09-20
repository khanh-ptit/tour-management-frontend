import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getUserList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${prefixAdmin}users?${queryString}`);
  return result;
};

export const deleteUser = async (id) => {
  const result = await del(`${prefixAdmin}users/delete/${id}`);
  return result;
};

export const editUser = async (id, data) => {
  const result = await patch(`${prefixAdmin}users/edit/${id}`, data);
  return result;
};
