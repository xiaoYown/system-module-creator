interface SysModelProps {
  name: string;
  version: string;
}

class PluginManager {
  publicUrl = '/public/libs';
  
  sysResourceFolder = '/sys-resource';
  sysLibFileName = 'main.js';


  loadLibSys = (moduleInfo: SysModelProps) => {
    const { name, version } = moduleInfo;
    const filename = `${this.publicUrl}/${name}/${version}/${this.sysLibFileName}`;
    return System.import(`${this.publicUrl}${filename}.js`);
  }
}
