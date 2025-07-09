// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventBus from "../Event/EventBus";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Timer {

    eventBuss: EventBus = EventBus.Instance;
    active: boolean = false;

    timerName: string = "";
    time: number = 0;
    timerMax: number = 0;

    constructor(name: string, max: number)
    {
        this.timerName = name;
        this.timerMax = max;
        this.time = max;
        this.eventBuss.Subscribe("Timer", this.up);
        this.active = true;
    }

    start () {

    }

    up() {
        if (this.active == false) { return; }

        this.time--;
        console.log("Timer Atualized = " + this.timerName);
        console.log("Time = " + this.time + " | " + this.timerMax);
        if (this.time <= 0) {
            this.Destroy();
            this.eventBuss.Notify({eventName: "Timer:" + this.timerName, data: this});
            this.active = false;
        }
    }

    private Destroy() {
        this.eventBuss.Unsubscribe("Timer", this.up);
        
    }
}
