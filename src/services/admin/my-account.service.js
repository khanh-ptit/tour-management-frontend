import { del, get, patch, post } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getInfo = async () => {
  const result = await get(`${prefixAdmin}my-account/info`);
  return result;
};

export const changePassword = async (data) => {
  const result = await patch(`${prefixAdmin}my-account/change-password`, data);
  return result;
};

export const editInfo = async (data) => {
  const result = await patch(`${prefixAdmin}my-account/edit`, data);
  return result;
};
