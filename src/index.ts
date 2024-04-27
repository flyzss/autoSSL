import * as acme from "acme-client";
import { challengeCreateFn, challengeRemoveFn } from "./challenge";
import { configSave } from "./save";

async function main() {
    acme.setLogger(console.log);
    const config=await configSave.readConfigSync();
    if(!config||!config.accountKey){
         configSave.saveConfig({accountKey:((await acme.crypto.createPrivateKey()).toString('utf8')),accountEmail:'abc@gmail.com',commonName:'abc.com',altNames:['abc.com','*.abc.com']},()=>{});
         throw new Error('请配置config.evn文件');
    }
    /* Init client */
    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.staging,
        accountKey: config.accountKey
    });

    /* Create CSR */
    const [key, csr] = await acme.crypto.createCsr({
        commonName: config.commonName,
        altNames: config.altNames,
    });

    /* Certificate */
    const cert = await client.auto({
        csr,
        email: config.accountEmail,
        termsOfServiceAgreed: true,
        challengeCreateFn,
        challengeRemoveFn
    });

    /* Done */
    console.log(`CSR:\n${csr.toString()}`);
    console.log(`Private key:\n${key.toString()}`);
    console.log(`Certificate:\n${cert.toString()}`);
}
main();




