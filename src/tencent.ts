// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
import * as tencentcloud from "tencentcloud-sdk-nodejs-dnspod";
import { configSave } from "./save";

const DnspodClient = tencentcloud.dnspod.v20210323.Client;
const config= configSave.readConfigSync();
if(!config?.tencent?.secretId||!config?.tencent?.secretKey){
    configSave.saveConfig({...config,tencent:{secretId:'SecretId',secretKey:'SecretKey'}});
    throw new Error('没有配置腾讯云密钥，请配置config.evn文件');
}

// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
const clientConfig = {
  credential: {
    secretId: config.tencent.secretId,
    secretKey: config.tencent.secretKey,
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "dnspod.tencentcloudapi.com",
    },
  },
};

// 实例化要请求产品的client对象,clientProfile是可选的
export const dnspodclient = new DnspodClient(clientConfig);
