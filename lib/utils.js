export function arrayBufferToBase64String(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return btoa(byteString);
}

export function base64StringToArrayBuffer(b64str) {
  const byteStr = atob(b64str);
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    bytes[i] = byteStr.charCodeAt(i);
  }
  return bytes.buffer;
}

export function textToArrayBuffer(str) {
  const buf = unescape(encodeURIComponent(str)); // 2 bytes for each char
  const bufView = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    bufView[i] = buf.charCodeAt(i);
  }
  return bufView;
}

export function arrayBufferToText(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let str = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    str += String.fromCharCode(byteArray[i]);
  }
  return str;
}

export function arrayBufferToBase64(arr) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)));
}

export function convertBinaryToPem(binaryData, label) {
  const base64Cert = arrayBufferToBase64String(binaryData);
  let pemCert = `-----BEGIN ${label}-----\r\n`;
  let nextIndex = 0;
  while (nextIndex < base64Cert.length) {
    if (nextIndex + 64 <= base64Cert.length) {
      pemCert += base64Cert.substr(nextIndex, 64) + "\r\n";
    } else {
      pemCert += base64Cert.substr(nextIndex) + "\r\n";
    }
    nextIndex += 64;
  }
  pemCert += `-----END ${label}-----\r\n`;
  return pemCert;
}

export function convertPemToBinary(pem) {
  const lines = pem.split('\n');
  let encoded = '';
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim().length > 0 &&
        lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END RSA PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-BEGIN PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-END PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END PUBLIC KEY-') < 0) {
      encoded += lines[i].trim();
    }
  }
  return base64StringToArrayBuffer(encoded);
}
