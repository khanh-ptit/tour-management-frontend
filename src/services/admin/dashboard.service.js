import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getUserCount = async () => {
  const result = await get(`${prefixAdmin}dashboard/user-count`);
  return result;
};

export const getTourCount = async () => {
  const result = await get(`${prefixAdmin}dashboard/tour-count`);
  return result;
};

export const getOrderCount = async () => {
  const result = await get(`${prefixAdmin}dashboard/order-count`);
  return result;
};

export const getThisMonthProfit = async () => {
  const result = await get(`${prefixAdmin}dashboard/this-month-profit`);
  return result;
};

export const getRecentProfit = async () => {
  const result = await get(`${prefixAdmin}dashboard/profit`);
  return result;
};

export const getRecentDebt = async () => {
  const result = await get(`${prefixAdmin}dashboard/debt`);
  return result;
};
