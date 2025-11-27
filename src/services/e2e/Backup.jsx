import React, { useRef, useState } from 'react'

import axios from 'axios';
import { hexToBuf } from './EncryptAndDecrypt';
import { buf2hex } from './hkdf';
export async function decodeLastestEBKtoBK(ebk,pin) {
  try {
    const { ebk: ebkB64, salt: saltHex } = ebk;
    const salt =hexToBuf(saltHex)
    const kek = await deriveKeyFromPIN(pin, salt);
    const { iv: ivArray, cipher: cipherArray } = JSON.parse(atob(ebkB64));
    const iv = new Uint8Array(ivArray);
    const cipher = new Uint8Array(cipherArray);
    const bkBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      kek,
      cipher
    );

    const bk = new Uint8Array(bkBuffer);
    return {bk,bkVersion:ebk.bkVersion}; 
  } catch (err) {
    console.error("❌ Failed to decode EBK:", err);
    throw err;
  }
};
export async function decryptByBKKey(ciphertext, iv, bk) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    bk,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );
  const plaintext = new TextDecoder().decode(decryptedBuffer);
  return plaintext;
}
 export async function encryptByBKKey(plaintext, bk) {

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    bk,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );

  const ciphertext = new Uint8Array(cipherBuffer);

  return {
    ciphertext:buf2hex(ciphertext), 
    iv:buf2hex(iv)        
  };
}
export async function createBKKey(pin) {
  const bk = crypto.getRandomValues(new Uint8Array(32)); 
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const kek = await deriveKeyFromPIN(pin, salt);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    kek,
    bk
  );
  const ebk = btoa(JSON.stringify({ iv: Array.from(iv), cipher: Array.from(new Uint8Array(cipher)) }));
 const res = await axios.post("http://localhost:8080/backup-register", {
  ebk,
  salt: buf2hex(salt),
}, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } });

console.log(res.data);

const bkVersion = res.data.result.bkVersion;
const username = res.data.result.username;

return { bk: buf2hex(bk), bkVersion, username };
}
export async function deriveKeyFromPIN(pin, salt) {
  const enc = new TextEncoder();
  const pinBytes = enc.encode(pin);
  const saltBytes = salt instanceof Uint8Array ? salt : new Uint8Array(salt);

  const baseKey = await crypto.subtle.importKey(
    'raw', 
    pinBytes, 
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // 3️⃣ Dẫn xuất key 256-bit bằng PBKDF2 + SHA-256
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true, // cho phép export key nếu cần
    ['encrypt', 'decrypt']
  );

  return derivedKey; // AES-GCM key (CryptoKey object)
}




export default function Backup() {
  
}