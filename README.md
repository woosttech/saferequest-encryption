# SafeRequest encryption/decryption libraries
_[WIP] This library and documentation are a Work In Progress._

This library is created by [Woost Technologies](https://woost.tech) and is used at secure file sharing service [SafeRequest](https://saferequest.net) for encryption and decryption. The library contains AES and RSA functions and relies heavily on the [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) framework.

## TODO
- Add unit tests
- Document code
- Improve README

# Libraries
## RSA
This library is set up to use 4096-bits RSA-OAEP encryption with SHA-256 digest.

### `generateKeyPair()`
Generates a 4096-bits RSA-OAEP keypair and returns a Promise with an object containing the generated CryptoKeyPair and the private and public keys as PEM-formatted strings.

### `encryptStringWithPublicKey(key, string)`
Encrypts `string` with the `key` public key. `key` can be a PEM-formatted string or CryptoKey. Returns a Promise containing the base64-encoded encrypted string.

### `decryptStringWithPrivateKey(key, encrypted64)`
Decrypts base64-encoded `encrypted64`-string using the `key` private key. `key` can be a PEM-formatted string or CryptoKey. Returns a Promise containing the decrypted string.

### `testKeyPairMatches(privateKey, publicKey)`
Generates a random string and checks whether that string can be encrypted using `publicKey` and subsequently be decrypted using `privateKey`. Returns a Promise containing a boolean whether the test succeeded.

## AES
This library is set up to use 256-bits AES-GCM encryption.

### `generateKey()`
Generates a random AES-key. Returns a Promise containing the key as a base64-encoded string.

### `generateIv()`
Generates a random initialization vector. Returns a Promise containing the initialization vector as a hex-encoded string.

### `encryptFile(key, iv, file)`
Encrypts `file` File using hex-encoded `iv` initialization vector and `key` base64-encoded AES-key. Returns a Promise containing the encrypted File.

### `decryptFile(key, iv, encryptedFile)`
Decrypts `encryptedFile` File using hex-encoded `iv` initialization vector and `key` base64-encoded AES-key. Returns a Promise contaning the decrypted File.

# Installation
Using npm:
```sh
npm i @woosttech/saferequest-encryption
```

# Usage
```javascript
import { aes, rsa } from '@woosttech/saferequest-encryption';

/* RSA */
console.log('Running RSA tests...');

const keyInfo = await rsa.generateKeyPair();
console.log('Generated keypair:', keyInfo);

const keyPairMatches = await rsa.testKeyPairMatches(keyInfo.privatePem, keyInfo.publicPem);
console.log('Public and private key match:', keyPairMatches);

const string = 'The quick brown fox jumps over the lazy dog.';
console.log('Encrypting string:', string);

const encryptedString = await rsa.encryptStringWithPublicKey(keyInfo.publicPem, string);
console.log('Encrypted string:', encryptedString);

const decryptedString = await rsa.decryptStringWithPrivateKey(keyInfo.privatePem, encryptedString);
console.log('Decrypted string:', decryptedString);

const stringsMatch = string === decryptedString;
console.log('Original and decrypted string match:', stringsMatch);


/* AES */
console.log('Running AES tests...');

const iv = await aes.generateIv();
console.log('Generated AES IV:', iv);

const key = await aes.generateKey();
console.log('Generated AES key:', key);

const file = new File(['Test'], 'test.txt', { type: 'text/plain' });
const fileContents = await file.text();
console.log('Encrypting dummy file:', file, 'with contents:', fileContents);

const encryptedFile = await aes.encryptFile(key, iv, file);
console.log('Encrypted file:', encryptedFile);

const decryptedFile = await aes.decryptFile(key, iv, encryptedFile);
const decryptedFileContents = await decryptedFile.text();
console.log('Decrypted file:', decryptedFile, 'with contents:', decryptedFileContents);

const filesMatch = fileContents === decryptedFileContents;
console.log('Original and decrypted file match:', filesMatch);
```

# Questions and feedback
Please open a [GitHub issue](https://github.com/woosttech/saferequest-encryption/issues) or contact us at [info@woost.tech](mailto:info@woost.tech).

# Contributing
Feel free to submit a [pull request](https://github.com/woosttech/saferequest-encryption/pulls)!