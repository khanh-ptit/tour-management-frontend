import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getRoleList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${prefixAdmin}roles?${queryString}`);
  return result;
};

export const deleteRole = async (id) => {
  const result = await del(`${prefixAdmin}roles/delete/${id}`);
  return result;
};

export const createRole = async (data) => {
  const result = await post(`${prefixAdmin}roles/create`, data);
  return result;
};

export const editRole = async (id, data) => {
  const result = await patch(`${prefixAdmin}roles/edit/${id}`, data);
  return result;
};
