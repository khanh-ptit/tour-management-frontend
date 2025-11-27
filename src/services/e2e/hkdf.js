//chuyen mang byte sang chuoi hex de doc
export function buf2hex(buf) {
    return [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
}
//hkdf extract tạo khóa giả ngẫu nhiên prk cố định 32 byte dữ liệu sạc để sinh ra caccs khóa thật sự rootkey,chain key..
export async function hkdfExtract(salt, ikm) {
    //thực chất là tính hmac(salt,ikm)
    const key = await crypto.subtle.importKey(
        'raw',
        salt || new Uint8Array(32), // nếu salt null thì dùng 32 bytes zero
        { name: 'HMAC', hash: 'SHA-256' },
        false, // key không export được
        ['sign']
    );
    //trong webcrpto hmac được sinh ra từ việc sign  chứ không có hàm HMAC riêng biệt.
    //Vì mục đích PRK chỉ cần HMAC output, nên không cần verify hay export key.
    //PRK = HMAC(salt, IKM).
    const prk = await crypto.subtle.sign('HMAC', key, ikm);
    return new Uint8Array(prk);
}
//đây là phần mở rộng của hkdf
//nhân tham số infor dữ liệu ngữ cảnh metadata để tạo các key khác nhau từ 1 prk
//độ dài cố định 32 bit
//từ prk và infor tạo ra key dài dùng cho tạo root,chain key
//muc đích hàm từ 1 prk có thể tạo nhiều prk có thể tái sử dụng được nếu thêm infor(metadata)
export async function hkdfExpand(prk, info, length = 32) {
    //biến PRK thành CryptoKey hợp lệ cho WebCrypto
    const key = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    //   prev = block HMAC trước,

    // output = tổng hợp các block,

    // counter = đánh số block.
    let prev = new Uint8Array(0);
    let output = new Uint8Array(0);
    let counter = 1;
    // Dùng cơ chế prev || info || counter để các block khác nhau.
    while (output.length < length) {
        const input = new Uint8Array(prev.length + info.length + 1);
        input.set(prev, 0);
        input.set(info, prev.length);
        input[input.length - 1] = counter;

        prev = new Uint8Array(await crypto.subtle.sign('HMAC', key, input));
        output = new Uint8Array([...output, ...prev]);
        counter++;
    }

    return output.slice(0, length);
}
//tạo rootKey và chainKey dùng cho Double Ratchet
export async function deriveRootAndChainKeys(IKM, salt) {
    //2 thông tin infor giúp hmac tạo nhiều prk sử dụng cho nhiều mục đích khác nhau
    const infoRoot = new TextEncoder().encode("X3DH:root");
    //.encode() → trả về mảng byte UTF-8 của chuỗi đó,
    const infoCK = new TextEncoder().encode("X3DH:cks");
    const prk = await hkdfExtract(salt, IKM);
    //Chain key → message key → mã hóa từng tin nhắn.
    // Root key → update chain key khi DH mới (ví dụ Bob gửi ephemeral key mới) bằng cách kết hợp root cũ và dh public mới
    const rootKey = await hkdfExpand(prk, infoRoot, 32);
    const chainKey = await hkdfExpand(prk, infoCK, 32);
    console.log("RootKey:", buf2hex(rootKey));
    console.log("ChainKey:", buf2hex(chainKey));
    return { rootKey, chainKey };
}
//ham để tính mk từ chainkey
export async function deriveMessageKey(chainKey) {
    // 1. Chuẩn bị thông tin "metadata" cho HKDF
    const info = new TextEncoder().encode("MessageKey");

    // 2. Sinh Message Key bằng HKDF
    const msgKey = await hkdfExpand(chainKey, info, 32);

    // 3. Trả về Message Key 32 bytes
    return msgKey;
}
//hmac có inp mảng chứa khóa bí mật ,mảng chứa dữ liệu cần kí
//input giống nhau đầu ra hoàn toàn giống nhau
export async function HMAC(keyBytes, dataBytes) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataBytes);
    return new Uint8Array(signature);
}