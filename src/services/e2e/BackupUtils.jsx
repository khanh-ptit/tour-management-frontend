import axios from "axios"
import { encryptByBKKey } from "./Backup"
import { hexToBuf } from "./EncryptAndDecrypt"

export async function backupMsg(inputMessage,bkInfor,msg){
 const encryptInfo=await encryptByBKKey(inputMessage,hexToBuf(bkInfor.bk))
const backupMsgs={
bkVersion:bkInfor.bkVersion,
iv:encryptInfo.iv,
cipherText:encryptInfo.ciphertext,
conversationId:localStorage.getItem("currentConversationId"),
receiver:localStorage.getItem("username"),
sender:msg.sender
}
const backupRes= await axios.post(`http://localhost:8080/backup-message`,backupMsgs,
   { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } })   
}