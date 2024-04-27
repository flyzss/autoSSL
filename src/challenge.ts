import { dnspodclient } from "./tencent";
/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */

export async function challengeCreateFn(authz, challenge, keyAuthorization) {
    console.log('Triggered challengeCreateFn()');

    /* http-01 */
    if (challenge.type === 'http-01') {
        const filePath = `/var/www/html/.well-known/acme-challenge/${challenge.token}`;
        const fileContents = keyAuthorization;

        console.log(`Creating challenge response for ${authz.identifier.value} at path: ${filePath}`);

        /* Replace this */
        console.log(`Would write "${fileContents}" to path "${filePath}"`);
        // await fs.writeFile(filePath, fileContents);
    }

    /* dns-01 */
    else if (challenge.type === 'dns-01') {
        const dnsRecord = `_acme-challenge.${authz.identifier.value}`;
        const recordValue = keyAuthorization;

        console.log(`Creating TXT record for ${authz.identifier.value}: ${dnsRecord}`);
        const params = {
            Domain: authz.identifier.value,
            RecordType: "TXT",
            RecordLine: "默认",
            TTL: 300,
            Value: recordValue
        };
        dnspodclient.CreateRecord(params).then(
        (data) => {
            console.log(data);
        },
        (err) => {
            console.error("error", err);
        }
        );
        /* Replace this */
        console.log(`Would create TXT record "${dnsRecord}" with value "${recordValue}"`);
        // await dnsProvider.createRecord(dnsRecord, 'TXT', recordValue);
    }
}


/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */

export async function challengeRemoveFn(authz, challenge, keyAuthorization) {
    console.log('Triggered challengeRemoveFn()');

    /* http-01 */
    if (challenge.type === 'http-01') {
        const filePath = `/var/www/html/.well-known/acme-challenge/${challenge.token}`;

        console.log(`Removing challenge response for ${authz.identifier.value} at path: ${filePath}`);

        /* Replace this */
        console.log(`Would remove file on path "${filePath}"`);
        // await fs.unlink(filePath);
    }

    /* dns-01 */
    else if (challenge.type === 'dns-01') {
        const dnsRecord = `_acme-challenge.${authz.identifier.value}`;
        const recordValue = keyAuthorization;

        console.log(`Removing TXT record for ${authz.identifier.value}: ${dnsRecord}`);
        dnspodclient.DescribeRecordList({Domain: authz.identifier.value}).then(
        (data) => {
            console.log(data.RecordList);
        },
        (err) => {
            console.error("error", err);
        }
        )
        /* Replace this */
        console.log(`Would remove TXT record "${dnsRecord}" with value "${recordValue}"`);
        // await dnsProvider.removeRecord(dnsRecord, 'TXT');
    }
}