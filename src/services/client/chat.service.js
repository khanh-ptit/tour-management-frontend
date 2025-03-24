import { get, post } from "../../utils/request";

const version = "api/v1";

export const getChatByRoom = async (id) => {
  const result = await get(`${version}/chat/${id}`);
  return result;
};

export const sendMessage = async (options) => {
  const result = await post(`${version}/chat/create`, options);
  return result;
};
