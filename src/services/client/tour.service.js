import { get } from "../../utils/request";
const version = "api/v1";

export const getTourByCategory = async (slug, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  // console.log(queryString);
  const result = await get(`${version}/tour-categories/${slug}?${queryString}`);
  return result;
};

export const getTourByName = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${version}/tours?${queryString}`);
  return result;
};

export const getTourDetail = async (slug) => {
  const result = await get(`${version}/tours/detail/${slug}`);
  return result;
};
