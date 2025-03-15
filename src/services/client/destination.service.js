import { get } from "../../utils/request";
const version = "api/v1";

export const getToursByDestination = async (slug, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${version}/destinations/${slug}?${queryString}`);
  return result;
};
