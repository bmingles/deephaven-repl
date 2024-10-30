// Experiment with generating a key pair, uploading the public key to the server,
// and authenticating with the private key.
import { createClient, generateBase64KeyPair, keyWithSentinel, loginClientWithKeyPair, uploadPublicKey, } from '@deephaven-enterprise/auth-nodejs';
import { loginPrompt } from './utils/loginPrompt.mjs';
import { getDhe } from './utils/dheUtils.mjs';
const { serverUrl, username, password } = await loginPrompt();
const credentials = {
    type: 'password',
    username,
    token: password,
};
const dhe = await getDhe(serverUrl);
const dheClient = await createClient(dhe, serverUrl);
const { publicKey, privateKey } = await generateBase64KeyPair();
console.log();
console.log([
    `user ${username}`,
    `operateas ${username}`,
    `public ${keyWithSentinel('ec', publicKey)}`,
    `private ${keyWithSentinel('ec', privateKey)}`,
].join('\n'));
console.log();
await uploadPublicKey(dheClient, credentials, publicKey, 'ec');
const keyPairCredentials = {
    type: 'keyPair',
    username: credentials.username,
    keyPair: {
        type: 'ec',
        publicKey,
        privateKey,
    },
};
await loginClientWithKeyPair(await createClient(dhe, serverUrl), keyPairCredentials);
process.exit(0);