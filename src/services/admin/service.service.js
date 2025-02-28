import { get } from "../../utils/request";

const prefixAdmin = "api/v1/admin/";

export const getServiceList = async () => {
  const result = await get(`${prefixAdmin}services`);
  return result;
};
