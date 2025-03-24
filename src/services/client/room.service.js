import { get } from "../../utils/request";
const version = "api/v1";

export const getRoomChatUserId = async () => {
  const result = await get(`${version}/room-chat`);
  return result;
};
