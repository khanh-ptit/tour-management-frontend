import { openDB } from 'idb';
import { b64ToU8 } from './verifySpkSignature';

// Nối các DH outputs thành IKM duy nhất
function concatUint8Arrays(arrays) {
    let totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
    let result = new Uint8Array(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

// DH function
async function dh(privKey, pubKey) {
    const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: pubKey },
        privKey,
        256 // 32 bytes
    );
    return new Uint8Array(shared);
}

// Tính IKM từ sender public key và receiver private key
export async function computeDHFromSenderEK(senderOtherEKPub, receiverId) {
    const db = await openDB('secure-chat-db');
    // 1️⃣ Lấy private SPK và OPK của receiver 
    const prekeys = await db.get('prekeys', receiverId);
    if (!prekeys) throw new Error("Receiver's prekeys not found in IndexedDB");
    const spkPriv = await crypto.subtle.importKey(
        'pkcs8',
        b64ToU8(prekeys.spk_priv).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, ['deriveBits']
    );

    let opkPriv = null;
    if (prekeys.opk_list && prekeys.opk_list.length > 0) {
        opkPriv = await crypto.subtle.importKey(
            //pkcs8 dùng cho private key
            'pkcs8',
            b64ToU8(prekeys.opk_list[0].private).buffer, { name: 'ECDH', namedCurve: 'P-256' },
            true, ['deriveBits']
        );
    }
    // 2️⃣ Import ephemeral public key của sender
    const senderEKPub = await crypto.subtle.importKey(
        'raw',
        b64ToU8(senderOtherEKPub).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, []
    );

    // 3️⃣ Tính DH outputs
    const DH1 = await dh(spkPriv, senderEKPub); // SPK_priv x EK_pub
    let DH2 = null;
    if (opkPriv) DH2 = await dh(opkPriv, senderEKPub); // OPK_priv x EK_pub
    // 4️⃣ Nối thành IKM
    const dhArray = [DH1];
    if (DH2) dhArray.push(DH2);
    const IKM = concatUint8Arrays(dhArray);
    console.log("IKM computed, length:", IKM.length);
    return IKM;
}
///