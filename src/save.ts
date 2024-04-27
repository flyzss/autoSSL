import * as fs from 'fs';
import * as path from 'path';

interface ACMEINFO{
    accountKey:string
    accountEmail:string
    commonName:string
    altNames:string[]
}

class ConfigManager<T> {
  private configPath: string;

  constructor(configFileName: string) {
    this.configPath = path.join(process.cwd(), configFileName);
  }

  // 同步地读取配置文件
  public readConfigSync(): T | null {
    try {
      const data = fs.readFileSync(this.configPath, { encoding: 'utf8' });
      return JSON.parse(data) as T;
    } catch (err) {
      console.error('读取配置文件时发生错误:', err);
      return null;
    }
  }

  // 异步地保存配置文件
  public saveConfig(configObject: T, callback: (err?: NodeJS.ErrnoException) => void): void {
    const data = JSON.stringify(configObject, null, 2); // 格式化为美观的JSON
    fs.writeFileSync(this.configPath, data, { encoding: 'utf8' });
  }
}

const configSave=new ConfigManager<ACMEINFO>('config.evn');
export  {configSave,ConfigManager}