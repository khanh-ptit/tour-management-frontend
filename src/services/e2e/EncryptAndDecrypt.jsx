
import React, { useState } from 'react'
import { buf2hex, deriveMessageKey } from './hkdf'
export function hexToBuf(hex) {
  // Loại bỏ khoảng trắng, chữ hoa/thường không quan trọng
  hex = hex.replace(/[^0-9a-f]/gi, '');
  
  // Tạo mảng byte (mỗi 2 ký tự hex = 1 byte)
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
 export async function encryptMsg(msg, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(msg));
  return { iv, ciphertext: new Uint8Array(ciphertext) };
}
export async function decryptMsg(ciphertext, iv, key) {
  const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext);
  return new TextDecoder().decode(plain);
}
export default function EncryptAndDecrypt() {
 //encrypt: cần iv(random) giúp các tin nhắn với nội dung giông nhau và cùng key nhưng ciphertext sẽ khác,planitext,messageKey
 //decrypt : cần iv Của encrypt,Messagekey giống encrpy và ciphertext 
 const [plaintext,setPlainText]=useState("")
 const [ciphertext,setCipherText]=useState("")
 const [mk,setMk]=useState("")
const [iv,setIv]=useState("")

const  handleEncript=async ()=>{
     const chainKey = hexToBuf(mk);

  const key = await deriveMessageKey(chainKey);

    console.log(buf2hex(iv),buf2hex(ciphertext))

    setIv(buf2hex(iv))
    setCipherText(buf2hex(ciphertext))
}
const handleDecript=async ()=>{
   const chainKey = hexToBuf(mk);

  const key = await deriveMessageKey(chainKey);
   const msg= await(decryptMessage(hexToBuf(ciphertext),hexToBuf(iv),key))
console.log(msg)
}
async function decryptMessage(ciphertext, iv, key) {
  const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext);
  return new TextDecoder().decode(plain);
}

    return (
    <div>
<input type="text" placeholder='plaintext' value={plaintext} onChange={(e)=>setPlainText(e.target.value)}/>
<input type="text" placeholder='ChainKey' value={mk} onChange={(e)=>setMk(e.target.value)}/>
<input type="text" placeholder='ciphertext' value={ciphertext} onChange={(e)=>setCipherText(e.target.value)}/>
<input type="text" placeholder='iv' value={iv} onChange={(e)=>setIv(e.target.value)} />
<button className='gen_but' onClick={handleEncript}>
    encrpt
</button>
<button className='gen_button' onClick={handleDecript}>
    decript
</button>
    </div>
  )
}
