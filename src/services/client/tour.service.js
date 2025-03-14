import { get } from "../../utils/request";
const version = "api/v1";

export const getTourByCategory = async (slug, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  // console.log(queryString);
  const result = await get(`${version}/tour-categories/${slug}?${queryString}`);
  return result;
};
