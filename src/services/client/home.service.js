import { get } from "../../utils/request";
const version = "api/v1";

export const getToursByCategory = async (slug) => {
  const result = get(`${version}/home/tour-categories/${slug}`);
  return result;
};

export const getDestination = async (slug) => {
  const result = get(`${version}/home/destinations/${slug}`);
  return result;
};
