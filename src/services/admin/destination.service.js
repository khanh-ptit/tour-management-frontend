import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getDestinationList = async () => {
  const result = await get(`${prefixAdmin}destinations`);
  return result;
};

export const deleteDestination = async (slug) => {
  const result = await del(`${prefixAdmin}destinations/delete/${slug}`);
  return result;
};

export const createDestination = async (options) => {
  const result = await post(`${prefixAdmin}destinations/create`, options);
  return result;
};

export const updateDestination = async (slug, options) => {
  const result = await patch(
    `${prefixAdmin}destinations/edit/${slug}`,
    options
  );
  return result;
};
