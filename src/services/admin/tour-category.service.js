import { del, get, patch, post } from "../../utils/request";

const prefixAdmin = "api/v1/admin/";

export const getTourCategoryList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const result = await get(`${prefixAdmin}tour-categories?${queryString}`);
  return result;
};

export const getTourCategoryDetail = async (slug) => {
  const result = await get(`${prefixAdmin}tour-categories/detail/${slug}`);
  return result;
};

export const deleteTourCategory = async (slug) => {
  const result = await del(`${prefixAdmin}tour-categories/delete/${slug}`);
  return result;
};

export const createTourCategory = async (options) => {
  const result = await post(`${prefixAdmin}tour-categories/create`, options);
  return result;
};

export const updateTourCategory = async (slug, options) => {
  const result = await patch(
    `${prefixAdmin}tour-categories/edit/${slug}`,
    options
  );
  return result;
};
