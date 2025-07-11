
const { ccclass, property } = cc._decorator;

@ccclass
export default class Logger extends cc.Component {
 

    @property
    showLog: Boolean = true;

  
    Log(message: string, sender: object): void {
        if (!this.showLog) return;
        console.log( `${sender.constructor.name}:`,message); 
        cc.log( `${sender.constructor.name}:`,message); 
    }
}