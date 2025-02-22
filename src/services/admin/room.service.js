import { del, get } from "../../utils/request";
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
