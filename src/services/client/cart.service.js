import { get, patch, post } from "../../utils/request";

const version = "api/v1";

export const addToCart = async (options) => {
  const result = await post(`${version}/cart/add`, options);
  return result;
};

export const getCart = async () => {
  const result = await get(`${version}/cart`);
  return result;
};

export const updateCart = async (options) => {
  const result = await patch(`${version}/cart/update`, options);
  return result;
};
