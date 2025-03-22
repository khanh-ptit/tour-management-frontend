import { get, post } from "../../utils/request";
const version = "api/v1";

export const createOrder = async (options) => {
  const result = await post(`${version}/orders/create`, options);
  return result;
};

export const getOrderList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${version}/orders?${queryString}`);
  return result;
};

export const getOrderDetail = async (id) => {
  const result = await get(`${version}/orders/detail/${id}`);
  return result;
};

export const checkPaymentStatus = async (id) => {
  const result = await get(`${version}/orders/check-payment/${id}`);
  return result;
};
