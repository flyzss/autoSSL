import * as acme from "acme-client";
import { challengeCreateFn, challengeRemoveFn } from "./challenge";
import { configSave,saveToFile } from "./save";


async function main() {
    acme.setLogger(console.log);
    const config=await configSave.readConfigSync();
    if(!config||!config.accountKey){
         configSave.saveConfig({accountKey:((await acme.crypto.createPrivateKey()).toString('utf8')),accountEmail:'abc@gmail.com',domain:'abc.com',commonName:'abc.com',altNames:['abc.com','*.abc.com'],path:'./',...config},()=>{});
         throw new Error('请配置config.evn文件');
    }
    config.lastUpdate=config.lastUpdate||0;
    if(new Date().getTime()-config.lastUpdate<1000*60*60*24*60){//证书到期前30天自动更新
        console.log('证书无需更新');
        return;
    }
    /* Init client */
    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.production,
        accountKey: config.accountKey,
        accountUrl: config.accountUrl
    });

    /* Create CSR */
    const [key, csr] = await acme.crypto.createCsr({
        commonName: config.commonName,
        altNames: config.altNames,
    });
    /* Certificate */
    const cert = await client.auto({
        csr,
        challengePriority: ['dns-01'],
        email: config.accountEmail,
        termsOfServiceAgreed: true,
        challengeCreateFn,
        challengeRemoveFn
    });

    /* Save to file */
    saveToFile(key,csr,cert,config.path||'./');
    /* Save to config */
    config.accountUrl=client.getAccountUrl();
    config.lastUpdate=new Date().getTime();
    configSave.saveConfig(config);
    /* Done */
    console.log(`CSR:\n${csr.toString()}`);
    console.log(`Private key:\n${key.toString()}`);
    console.log(`Certificate:\n${cert.toString()}`);
}

/**
 * 保存证书到文件
 * @param privateKey 
 * @param csr 
 * @param cert 
 * @param commonName 
 * @param path 
 */

main()



