// KEY GENERATION

async function generateKey() {
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      iv,
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const keyExported = await window.crypto.subtle.exportKey(
    'raw',
    key,
  );
  const keyString = Array
    .from(new Uint8Array(keyExported))
    .map(byte => String.fromCharCode(byte))
    .join('');
  const encodedKey = btoa(keyString);

  return encodedKey;
}

// IMPORT KEYS

async function decodeKey(encodedKey) {
  const keyString = atob(encodedKey);
  const keyArray = new Uint8Array(
    keyString
      .match(/[\s\S]/g)
      .map(ch => ch.charCodeAt(0))
  );

  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    keyArray,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt'],
  );

  return aesKey;
}

// INITIALIZATION VECTOR

async function generateIv() {
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const encodedIv = Array.from(iv)
    .map(b => `00${b.toString(16)}`.slice(-2))
    .join('');

  return encodedIv;
}

function decodeIv(encodedIv) {
  const iv = new Uint8Array(
    encodedIv
      .match(/.{2}/g)
      .map(byte => parseInt(byte, 16))
  );

  return iv;
}

// FILE ENCRYPTION/DECRYPTION

async function encryptFile(key, iv, file) {
  let decodedKey = key;
  if (typeof decodedKey === 'string') {
    decodedKey = await decodeKey(key);
  }

  let decodedIv = iv;
  if (typeof decodedIv === 'string') {
    decodedIv = decodeIv(iv);
  }

  const alg = {
    name: 'AES-GCM',
    iv: decodedIv,
  };

  const fileBuffer = await file.arrayBuffer();
  const fileUint8 = new Uint8Array(fileBuffer);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    alg,
    decodedKey,
    fileUint8,
  );
  const encryptedFile = new File([encryptedBuffer], file.name);

  return encryptedFile;
}

async function decryptFile(key, iv, encryptedFile) {
  let decodedKey = key;
  if (typeof decodedKey === 'string') {
    decodedKey = await decodeKey(decodedKey);
  }

  let decodedIv = iv;
  if (typeof decodedIv === 'string') {
    decodedIv = decodeIv(iv);
  }

  const alg = {
    name: 'AES-GCM',
    iv: decodedIv,
  };

  const fileBuffer = await encryptedFile.arrayBuffer();
  const fileUint8 = new Uint8Array(fileBuffer);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    alg,
    decodedKey,
    fileUint8,
  );
  const decryptedFile = new File([decryptedBuffer], encryptedFile.name);

  return decryptedFile;
}

export default {
  generateKey,
  generateIv,
  encryptFile,
  decryptFile,
};
