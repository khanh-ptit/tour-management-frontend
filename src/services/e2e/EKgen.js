// Hàm tạo ephemeral keypair đây là kháo chỉ dùng 1 lần hữu ích khi alice muốn sử dụng để tạo shared key vơi bob
import { openDB } from 'idb';
import axios from 'axios';

import { initDB } from './initDB';

function buf2b64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
export async function generateAndSendEphemeralKeyPair(username, conversation_id) {
    const keyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" },
        true, ["deriveKey", "deriveBits"]
    );
    const publicKeyBytes = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    const privateKeyBytes = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const publicKeyB64 = buf2b64(publicKeyBytes);
    const privateKeyB64 = buf2b64(privateKeyBytes);

    const db = await initDB();
    await db.put('ephemeral_keys', {
        conversationId: conversation_id,
        username: username,
        publicKey: publicKeyB64,
        privateKey: privateKeyB64,
        createdAt: new Date().toISOString()
    });
    console.log('Ephemeral key saved locally.');
    // 4️⃣ Gửi public key lên server (chỉ public)
    const payload = {
        conversationId: conversation_id,
        username: username,
        ephemeralPub: publicKeyB64
    };
    const res = await axios.post('http://localhost:8080/post-ephemeral', payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jtoken')}`,
            'Content-Type': 'application/json'
        }
    });
}