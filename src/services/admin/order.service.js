import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getOrderList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${prefixAdmin}orders?${queryString}`);
  return result;
};

export const deleteOrder = async (id) => {
  const result = await del(`${prefixAdmin}orders/delete/${id}`);
  return result;
};

export const getOrderDetailAdmin = async (id) => {
  const result = await get(`${prefixAdmin}orders/detail/${id}`);
  return result;
};

// export const createRole = async (data) => {
//   const result = await post(`${prefixAdmin}roles/create`, data);
//   return result;
// };

// export const editRole = async (id, data) => {
//   const result = await patch(`${prefixAdmin}roles/edit/${id}`, data);
//   return result;
// };

// export const editPermission = async (data) => {
//   const result = await patch(`${prefixAdmin}roles/permissions`, data);
//   return result;
// };
