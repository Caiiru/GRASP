// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CommonEvents } from "../../Script/Event/CommonEvents";
import EventBus from "../../Script/Event/EventBus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private _eventBus: EventBus = null; 
 
    start() { 
        this._eventBus = EventBus.Instance;
        if (!this._eventBus) {
            cc.error("EventBus instance is not initialized. Please ensure it is created before using it.");
            return;
        }
        this._eventBus.Subscribe(CommonEvents.GameFirstLoad, this.onGameFirstLoad, this);
    }

    onGameFirstLoad(){

        console.log("GameFirstLoad event received in MainMenu");

    }

    // update (dt) {}
}
