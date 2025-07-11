// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventBus from "../../../../Script/Event/EventBus";
import { InitializeEvents } from "../../../../Script/Event/EventsEnums/InitializeEvents";
import { LoginEvents } from "../../../../Script/Event/EventsEnums/LoginEvents";
import { IEvent } from "../../../../Script/Event/IEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuLoadingBar extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    Initialize() {
        if (!this.progressBar) {
            cc.error("MenuLoadingBar: ProgressBar is not assigned. Please assign a ProgressBar instance to the progressBar property.");
            return;
        }
        this.UpdateProgress(0);

        EventBus.Instance.Subscribe(InitializeEvents.GameLoadingProgress, (data) => { 
            this.UpdateProgress(data); 
        }, this);

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

        console.log(`${value*100}% progress received in GameLoadingProgress event.`);
        this.progressBar.progress = value;
    }

    // update (dt) {}
}
