import { get } from "../../utils/request";
const version = "api/v1";

export const getTourCategoryClientList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${version}/tour-categories?${queryString}`);
  return result;
};
