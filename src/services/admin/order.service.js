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
