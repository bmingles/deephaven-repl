import { createClient, loginClientWithPassword, } from '@deephaven-enterprise/auth-nodejs';
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
await loginClientWithPassword(dheClient, credentials);
deletePublicKeys(dheClient, username, ['']);
async function deletePublicKeys(dheClient, userName, publicKeys) {
    for (const toDelete of publicKeys) {
        // if (!toDelete.startsWith('RUM6')) {
        //   toDelete = `RUM6${toDelete}`
        // }
        const { dbAclWriterHost, dbAclWriterPort } = await dheClient.getServerConfigValues();
        const x = await fetch(`https://${dbAclWriterHost}:${dbAclWriterPort}/acl/publickey/${encodeURIComponent(userName)}?${encodeURIComponent('encodedStr')}=${encodeURIComponent(toDelete)}&${encodeURIComponent('algorithm')}=${encodeURIComponent('EC')}`, {
            method: 'DELETE',
            headers: {
                /* eslint-disable @typescript-eslint/naming-convention */
                Authorization: await dheClient.createAuthToken('DbAclWriteServer'),
                /* eslint-enable @typescript-eslint/naming-convention */
            },
        });
        console.log(x.status);
    }
    process.exit(0);
}
