import { openDB } from 'idb';
import { b64ToU8 } from './verifySpkSignature';
import { initDB } from './initDB';
import { hexToBuf } from './EncryptAndDecrypt';

//nối các dh_out thành ikm duy nhất làm đầu vào HKDF
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
//ham để dh diffe hullman lấy dữ liệu public other và private của mình 
export async function dh(privKey, pubKey) {
    const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: pubKey },
        privKey,
        256
    );

    return new Uint8Array(shared);
}
export async function computeWhenDhRatchet(conversationId, ekPub) {
    //lấy ek priv của mình kết hợp với ekpb của other
    const db = await initDB()
    const userEK = await db.get('ephemeral_keys', conversationId);
    if (!userEK) throw new Error("User's keys not found in IndexedDB");
    const myEKPriv = await crypto.subtle.importKey(
        'pkcs8',
        b64ToU8(userEK.privateKey).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, ['deriveBits']
    );
    //lấy ekpub của other
    const otherEKPub = await crypto.subtle.importKey(
        'raw',
        b64ToU8(ekPub).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, []
    );
    const DH1 = await dh(myEKPriv, otherEKPub);


    return DH1;
}

export async function computedDH(otherBundle, conversationId) {
    const db = await initDB();
    // Lấy private ephemeral key của user
    const userEK = await db.get('ephemeral_keys', conversationId);
    if (!userEK) throw new Error("User's keys not found in IndexedDB");
    const myEKPriv = await crypto.subtle.importKey(
        'pkcs8',
        b64ToU8(userEK.privateKey).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, ['deriveBits']
    );
    // Import public keys của Alice
    const otherSpk = await crypto.subtle.importKey(
        'raw',
        b64ToU8(otherBundle.spkPub).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, []
    );
    let otherOpk = null;
    otherOpk = await crypto.subtle.importKey(
        'raw',
        b64ToU8(otherBundle.opkPub).buffer, { name: 'ECDH', namedCurve: 'P-256' },
        true, []
    );
    // Tính DH outputs
    const DH1 = await dh(myEKPriv, otherSpk);
    let DH2 = null;
    if (otherOpk) DH2 = await dh(myEKPriv, otherOpk);
    // Nối thành IKM
    const dhArray = [DH1];
    if (DH2) dhArray.push(DH2);
    const IKM = concatUint8Arrays(dhArray);
    return IKM;
}