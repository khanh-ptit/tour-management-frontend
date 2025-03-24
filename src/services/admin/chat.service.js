import { get } from "../../utils/request";
const prefixAdmin = "api/v1/admin/";

export const getChatByRoom = async (roomChatId) => {
  const result = await get(`${prefixAdmin}chats/${roomChatId}`);
  return result;
};
