import { del, get, patch, post } from "../../utils/request";

const prefixAdmin = "api/v1/admin/";

export const getServiceList = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${prefixAdmin}services?${queryString}`);
  return result;
};

export const deleteService = async (id) => {
  const result = await del(`${prefixAdmin}services/delete/${id}`);
  return result;
};

export const createService = async (data) => {
  const result = await post(`${prefixAdmin}services/create`, data);
  return result;
};

export const editService = async (id, data) => {
  const result = await patch(`${prefixAdmin}services/edit/${id}`, data);
  return result;
};
