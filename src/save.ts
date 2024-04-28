import * as fs from 'fs';
import * as path from 'path';

interface ACMEINFO{
    accountKey:string
    accountUrl:string
    accountEmail:string
    domain:string
    commonName:string
    lastUpdate:number
    path:string
    altNames:string[]
    tencent:{
        secretId:string
        secretKey:string
    }
}

class ConfigManager<T> {
  private configPath: string;

  constructor(configFileName: string) {
    this.configPath = path.join(process.cwd(), configFileName);
  }

  // 读取配置文件
  public readConfigSync(): T | null {
    try {
      const data = fs.readFileSync(this.configPath, { encoding: 'utf8' });
      return JSON.parse(data) as T;
    } catch (err) {
      console.error('读取配置文件时发生错误:', err);
      return null;
    }
  }

  // 保存配置文件
  public saveConfig(configObject: T, callback?: (err?: NodeJS.ErrnoException) => void): void {
    // 将对象转换为JSON
    try {
        const data = JSON.stringify(configObject, null, 2); // 格式化为美观的JSON
        fs.writeFileSync(this.configPath, data, { encoding: 'utf8' });
    } catch (error) {
        console.error('保存配置文件时发生错误:', error);
        callback?.(error);  
    }

  }
}
function saveToFile(privateKey, csr, cert,path='./') {
    try {
    fs.writeFileSync(path+'key.pem',privateKey.toString(),'utf8');
    fs.writeFileSync(path+'csr.pem',csr.toString(),'utf8');
    fs.writeFileSync(path+'cert.pem',cert.toString(),'utf8');        
    } catch (error) {
        console.log('证书保存失败',error);
    }   
}
const configSave=new ConfigManager<ACMEINFO>('config.evn');
export  {configSave,ConfigManager,saveToFile}