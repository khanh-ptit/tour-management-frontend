import axios from "axios";
import { initDB } from "./initDB";
import { decryptMsg, hexToBuf } from "./EncryptAndDecrypt";
import { buf2hex, deriveRootAndChainKeys, HMAC } from "./hkdf";
import { computeWhenDhRatchet } from "./computeDh";
import { decryptByBKKey, encryptByBKKey } from "./Backup";

export async function getOtherKey(receiver) {
    const otherKeyResponse = await axios.get(
        `http://localhost:8080/get-other-key?username=${receiver}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } }
    );

    return otherKeyResponse.data.result;
}
export async function loadEphemeralKey(conversationId) {
    const db = await initDB()
    const record = await db.get("ephemeral_keys", conversationId);
    if (!record) {
        console.warn(" No ephemeral key found for conversation:", conversationId);
        return null;
    }
    return record;
}
export async function deriveMkToN(session, targetN) {
    const db = await initDB();
    let localSession = {...session, Nr: 0 };

    console.log(localSession.DHs)
    let mk;
    while (session.Nr < targetN) {
        mk = await HMAC(hexToBuf(session.ckr), new Uint8Array([0x01]));
        // mkStore[`${dhPub}_${session.Nr + 1}`] = buf2hex(mk);
        // update CKr cho tin nhắn tiếp theo
        session.ckr = buf2hex(await HMAC(hexToBuf(session.ckr), new Uint8Array([0x02])));
        session.Nr += 1;
    }
    //  await db.put('sessions', session);
    return mk; // mk cuối cùng dùng để giải mã message
}
// 🔐 Hàm giải mã 1 message bằng Double Ratchet
export async function decryptMessages(msg, session) {
    // Nếu DHpub của đối phương khác với DHr hiện tại → Ratchet step
    if (msg.dhPub !== session.DHr) {
        // 1️⃣ Update PN
        // 2️⃣ DH Ratchet(tao ikm chung mới )
        const newIkm = await computeWhenDhRatchet(localStorage.getItem("currentConversationId"), msg.dhPub)
            // 3️⃣ Derive new RK + CKr
        const db = await initDB()
        const oldSessions = await db.get("sessions", localStorage.getItem("currentConversationId"))
        const oldRootKey = oldSessions.rootKey
        const newKey = await deriveRootAndChainKeys(newIkm, hexToBuf(oldRootKey))
            // update session
        session = await db.get("sessions", localStorage.getItem("currentConversationId"))
        session.ckr = buf2hex(newKey.chainKey);
        session.rootKey = buf2hex(newKey.rootKey);
        session.DHr = msg.dhPub
        await db.put("sessions", session)
    }
    // 2Lấy message key từ mkStore nếu có (skip message)
    // const mkKey = mkStore[`${msg.dhPub}_${msg.n}`];
    // let mk;
    // if (mkKey) {
    //     mk = hexToBuf(mkKey);
    //     delete mkStore[`${msg.dhPub}_${msg.n}`]; // dùng xong thì xoá
    // } else {
    //     // 3️ Derive message keys từ Nr đến n của message
    //     mk = await deriveMkToN(session, msg.n, msg.dhPub);
    // }

    // 4️ Derive mk  từ  CKr //chay đến đúng n để giải mã 
    const mk = await deriveMkToN(session, msg.n);
    console.log(mk)
        // 6️ Decrypt ciphertext
    const plaintext = await decryptMsg(
        hexToBuf(msg.ciphertext),
        hexToBuf(msg.iv),
        mk
    );
    return plaintext;
}



export async function loadMessages(conversationId) {
    const pendingMessages = [];
    //dau tiên phải load từ backup db đã
    // 1️⃣ Lấy message pending từ server
    const res = await axios.get(
        `http://localhost:8080/getPendingMessage?conversationId=${conversationId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } }
    );
    // 2️⃣ Lấy session từ IndexedDB
    const db = await initDB();
    let bkInfor = await db.get("backup_keys", localStorage.getItem("username"));

    const session = await db.get("sessions", conversationId);
    console.log(session)
    for (const msg of res.data.result) {
        const plaintext = await decryptMessages(msg, session);
        //sau khi đã có giải mã được các plaintext tiếp tục backup plaitext đó
        if (bkInfor != null) {
            const encryptInfo = await encryptByBKKey(plaintext, hexToBuf(bkInfor.bk))
                //gui thong tin message backup len server
            const backupMsgs = {
                bkVersion: bkInfor.bkVersion,
                iv: encryptInfo.iv,
                cipherText: encryptInfo.ciphertext,
                conversationId: localStorage.getItem("currentConversationId"),
                receiver: msg.receiver.username,
                sender: msg.sender.username
            }
            const backupRes = await axios.post(`http://localhost:8080/backup-message`, backupMsgs, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } })
        }
        //  update trạng thái message là đã nhận 
        await axios.post(
            `http://localhost:8080/updateStatusMessage?id=${msg.id}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } }
        );
    }
    //lay tất cả bản backup của user ứng với bk version đó
    const allBackupMsg = await axios.get(`http://localhost:8080/get-message-from-backup?conversationId=${localStorage.getItem("currentConversationId")}&bkVersion=${bkInfor.bkVersion}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } })
        //giai ma từng msg này 

    for (const mes of allBackupMsg.data.result) {
        console.log(mes)
        const plaintext = await decryptByBKKey(hexToBuf(mes.cipherText), hexToBuf(mes.iv), hexToBuf(bkInfor.bk))
        pendingMessages.push({
            sender: mes.sender,
            content: plaintext,
            receiver: mes.receiver
        });
    }

    console.log(pendingMessages)
    return pendingMessages;
}