// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { IEvent } from "./IEvent";
import { IEventListener } from "./IEventListener";
import { IEventBus } from "./IEventBus";

const { ccclass, property } = cc._decorator;

@ccclass()
export default class EventBus extends cc.Component implements IEventBus<IEvent> {

    private static _instance: EventBus = null;
    private _listeners: Map<string, IEventListener[]> = new Map();

    // singleton
    public static get Instance(): EventBus {
        if (!EventBus._instance) {
            cc.error("EventBus instance does not exist. Please ensure it is initialized.");
        }
        return EventBus._instance;
    }
    protected onLoad(): void {
        // only one instance of EventBus exists
        if (EventBus._instance) {
            cc.error("EventBus instance already exists. Destroying the new instance.");
            this.destroy();
        } else {
            EventBus._instance = this;
            cc.game.addPersistRootNode(this.node);
        }
  
    } 
    protected onDestroy(): void {
        if (EventBus._instance === this) {
            EventBus._instance = null;
            this._listeners.clear();
        }
    }

    /**
     * Subscribe
     * Register a callback for a specific event.
     * If the event does not exist, it is created.
     * If the callback is already registered, it is not added again.
     */
    Subscribe(eventName: string, callback: Function, context?: any): void {
        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, []);
        }
        const listeners = this._listeners.get(eventName);
        if (listeners && !listeners.some(l => l.callback === callback && l.context === context)) {
            listeners.push({ callback: callback });        
        }
    } 
    /**
     * Unsubscribe
     * Remove a registered callback for a specific event.
     * If there are no more listeners for the event, the event is removed from the map.
     */
    Unsubscribe(eventName: string, callback: Function, context?:any): void {
        const listeners = this._listeners.get(eventName);
        if(listeners){
            this._listeners.set(eventName, listeners.filter(l => !(l.callback !== callback && l.context === context)));
            if (this._listeners.get(eventName)?.length === 0) {
                this._listeners.delete(eventName);
            }
        }
    }
    /**
     * Notify
     * Notify all listeners registered for a specific event.
     * If there are no listeners for the event, nothing happens.
     */
    Notify(event: IEvent): void {
        const listeners = this._listeners.get(event.eventName);
        if (listeners) {
            [...listeners].forEach(listener => { // Copy the listeners to avoid issues if they are modified during iteration
                try{
                    listener.callback.call(listener.context, event.data);
                }
                catch (error) {
                    console.error(`Error in event listener for ${event.eventName}:`, error);
                }
            });
        }
    }
}
