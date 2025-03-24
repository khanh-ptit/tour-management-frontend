import { get } from "../../utils/request";

const prefixAdmin = "api/v1/admin/";

export const getRoomChatAdmin = async () => {
  const result = await get(`${prefixAdmin}room-chat`);
  return result;
};
