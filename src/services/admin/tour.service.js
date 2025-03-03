import { del, get, patch, post } from "../../utils/request";

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

export const deleteTour = async (slug) => {
  const result = await del(`${prefixAdmin}tours/delete/${slug}`);
  return result;
};

export const getTourDetail = async (slug) => {
  const result = await get(`${prefixAdmin}tours/detail/${slug}`);
  return result;
};

export const updateTour = async (slug, options) => {
  const result = await patch(`${prefixAdmin}tours/edit/${slug}`, options);
  return result;
};
