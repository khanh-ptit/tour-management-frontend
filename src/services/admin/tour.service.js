import { get, post } from "../../utils/request";

const prefixAdmin = "api/v1/admin/";

export const getTourList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  // console.log(queryString);
  const result = await get(`${prefixAdmin}tours?${queryString}`);
  return result;
};

export const createTour = async (options) => {
  const result = await post(`${prefixAdmin}tours/create`, options);
  return result;
};
