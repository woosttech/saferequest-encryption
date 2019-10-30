import * as utils from './utils.js';

const algorithm = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

// IMPORT/EXPORT KEYS

async function importPublicKey(pemKey) {
  const key = await window.crypto.subtle.importKey(
    'spki',
    utils.convertPemToBinary(pemKey),
    algorithm,
    true,
    ['encrypt']
  );
  return key;
}

async function importPrivateKey(pemKey) {
  const key = await window.crypto.subtle.importKey(
    'pkcs8',
    utils.convertPemToBinary(pemKey),
    algorithm,
    true,
    ['decrypt']
  );
  return key;
}

async function exportPublicKey(keyPair) {
  const spki = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  return utils.convertBinaryToPem(spki, 'RSA PUBLIC KEY');
}

async function exportPrivateKey(keyPair) {
  const pkcs8 = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );
  return utils.convertBinaryToPem(pkcs8, 'RSA PRIVATE KEY');
}

// KEY PAIR GENERATION

async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    algorithm,
    true,
    ['encrypt', 'decrypt'],
  );

  const publicPem = await exportPublicKey(keyPair);
  const privatePem = await exportPrivateKey(keyPair);

  return {
    keyPair,
    publicPem,
    privatePem,
  };
}

// STRING ENCRYPTION/DECRYPTION

async function encryptStringWithPublicKey(key, string) {
  let decodedKey = key;
  if (typeof decodedKey === 'string') {
    decodedKey = await importPublicKey(key);
  }
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    algorithm,
    decodedKey,
    utils.textToArrayBuffer(string),
  );

  const encrypted64 = utils.arrayBufferToBase64(encryptedBuffer);

  return encrypted64;
}

async function decryptStringWithPrivateKey(key, encrypted64) {
  let decodedKey = key;
  if (typeof decodedKey === 'string') {
    decodedKey = await importPrivateKey(decodedKey);
  }

  const encrypted = utils.base64StringToArrayBuffer(encrypted64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    algorithm,
    decodedKey,
    encrypted,
  );

  const decrypted = utils.arrayBufferToText(decryptedBuffer);

  return decrypted;
}

async function testKeyPairMatches(privateKey, publicKey) {
  const testString = Math.random().toString(36).substring(2);

  try {
    const encrypted = await encryptStringWithPublicKey(publicKey, testString);
    const decrypted = await decryptStringWithPrivateKey(privateKey, encrypted);
    return decrypted === testString;
  } catch (e) {
    return false;
  }
}

export default {
  generateKeyPair,
  encryptStringWithPublicKey,
  decryptStringWithPrivateKey,
  testKeyPairMatches,
};
