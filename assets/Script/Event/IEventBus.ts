import { IEvent } from "./IEvent";

export interface IEventBus<T extends IEvent> {

    Subscribe(eventName:string, callback:Function):void;
    Unsubscribe(eventName:string, callback:Function):void;
    Notify(event:T):void;


}