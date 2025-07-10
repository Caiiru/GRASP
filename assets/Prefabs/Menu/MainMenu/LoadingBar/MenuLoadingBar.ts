// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuLoadingBar extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null; 

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    Initialize() {
        this.progressBar.progress = 0;

    }

    /**
     * Updates the progress bar value.
     * @param {number} value - The new value for the progress bar, should be between 0 and 1.
     */
    UpdateProgress(value: number) {
        if (value < 0 || value > 1) {
            cc.error("Progress value must be between 0 and 1.");
            return;
        }
        this.progressBar.progress = value;
    }

    // update (dt) {}
}
