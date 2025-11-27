//chuyển chuỗi base64 thành mảng byte
export function b64ToU8(b64) {
    if (b64 instanceof Uint8Array) {
        console.warn("⚠️ b64ToU8 nhận Uint8Array, bỏ qua decode");
        return b64;
    }
    if (typeof b64 !== 'string') {
        throw new TypeError(`b64ToU8 expected string but got ${typeof b64}`);
    }

    b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';

    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
}
//ngược lại chuyển mảng unit8 thành base64
function u8ToB64(u8) {
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s);
}

/**
 * Verify SPK signature (ECDSA P-256 SHA-256)
 * @param {string} spkPubB64 - SPK public key (base64)
 * @param {string} spkSigB64 - SPK signature (base64)
 * @param {string} ikPubB64 - IK public key (base64)
 * @param {object} opts - optional { keyFormat: 'raw' | 'spki' }
 * @returns {Promise<boolean>}
 */
export async function verifySpkSignature_ECDSA_P256(spkPubB64, spkSigB64, ikPubB64, opts = {}) {
    const keyFormat = opts.keyFormat || 'raw'; // default 'raw'
    //Chuyển base64 → Uint8Array vì WebCrypto chỉ làm việc với ArrayBuffer.
    const spkPubU8 = b64ToU8(spkPubB64);
    const sigU8 = b64ToU8(spkSigB64);
    const ikPubU8 = b64ToU8(ikPubB64);
    const ikKey = await crypto.subtle.importKey(
        keyFormat, // 'raw' hoặc 'spki', phải đúng format bên Alice export key
        //dữ liệu thực tế của ik
        ikPubU8.buffer,
        //thuật toán sử dụng để sinh key
        { name: 'ECDSA', namedCurve: 'P-256' },
        true, ['verify']
    );

    const valid = await crypto.subtle.verify(
        //thuat toan key
        { name: 'ECDSA', hash: 'SHA-256' },
        ikKey,
        //chữ kí 
        sigU8.buffer,
        //kiểm tra spk có thực sự được kí bỏi ik đó không tránh sự thay đổi quan MiTM
        spkPubU8.buffer
    );

    return valid;
}