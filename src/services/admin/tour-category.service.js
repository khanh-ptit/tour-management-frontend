import { get } from "../../utils/request";

const prefixAdmin = "api/v1/admin/";

export const getTourCategoryList = async () => {
  const result = await get(`${prefixAdmin}tour-categories`);
  return result;
};
