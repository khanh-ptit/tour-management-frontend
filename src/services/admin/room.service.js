import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getRoomList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  // console.log(queryString);
  const result = await get(`${prefixAdmin}rooms?${queryString}`);
  return result;
};

export const deleteRoom = async (slug) => {
  const result = await del(`${prefixAdmin}rooms/delete/${slug}`);
  return result;
};

export const createRoom = async (options) => {
  const result = await post(`${prefixAdmin}rooms/create`, options);
  return result;
};

export const getRoomDetail = async (slug) => {
  const result = await get(`${prefixAdmin}rooms/detail/${slug}`);
  return result;
};

export const updateRoom = async (slug, options) => {
  const result = await patch(`${prefixAdmin}rooms/edit/${slug}`, options);
  return result;
};
