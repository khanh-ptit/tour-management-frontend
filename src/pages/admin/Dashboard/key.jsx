import axios, { Axios } from 'axios';
import { openDB } from 'idb';
import { initDB } from './initDB';

//npm install @noble/curves
// Helper chuyển ArrayBuffer → base64
function buf2b64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
export async function initPreKey(username){
const db=await initDB()
const identityKeyPair = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: 'P-256' },
  true,
  ['sign', 'verify']
);
const signedPreKey = await crypto.subtle.generateKey(
  { name: "ECDH", namedCurve: 'P-256' },
  true,
  ['deriveKey', 'deriveBits']
);
const spkPubRaw = await crypto.subtle.exportKey('raw', signedPreKey.publicKey);
// Khi tạo SPK, cần  ký (sign) khóa công khai SPK bằng khóa riêng IK Khóa SPK này được sinh ra bởi chính chủ nhân của khóa IK
const signature = await crypto.subtle.sign(
  { name: 'ECDSA', hash: 'SHA-256' },
  identityKeyPair.privateKey,
  spkPubRaw
);
  const oneTimePreKeys = [];
  for (let i = 0; i < 1; i++) {
    const opk = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey', 'deriveBits']
    );
    const pub = await crypto.subtle.exportKey('raw', opk.publicKey);
    const priv = await crypto.subtle.exportKey('pkcs8', opk.privateKey);
    oneTimePreKeys.push({
      id: i + 1,
      public: buf2b64(pub),
      private: buf2b64(priv),
      used: false,
    });
  }
  const ik_pub = buf2b64(await crypto.subtle.exportKey('raw', identityKeyPair.publicKey));
  const ik_priv = buf2b64(await crypto.subtle.exportKey('pkcs8', identityKeyPair.privateKey));

  const spk_pub = buf2b64(await crypto.subtle.exportKey('raw', signedPreKey.publicKey));
  const spk_priv = buf2b64(await crypto.subtle.exportKey('pkcs8', signedPreKey.privateKey));

  await db.put('identity_keys', { username: username, ik_pub, ik_priv });
  await db.put('prekeys', {
    username: username,
    spk_pub,
    spk_priv,
    // spk_signature: buf2b64(signature),
    opk_list: oneTimePreKeys,
  });
    const publicBundle = {
    username: username,
   ikPub: ik_pub,
    spkPub:spk_pub,
    spkSignature: buf2b64(signature),
    opkList:oneTimePreKeys.map((opk) => ({
      id: opk.id,
      publicKey: opk.public,
      used: false,
    })),
  };
  
 axios.post("http://localhost:8080/post-key",publicBundle, { headers: {
    "Content-Type": "application/json",
   Authorization: `Bearer ${localStorage.getItem('jtoken')}` }})
    .then((res)=>{

 })
}

