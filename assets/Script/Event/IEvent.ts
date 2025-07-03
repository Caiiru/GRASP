
/**
 * @interface IEvent
 * Defines the structure for any event in our system.
 * All custom events should implement this interface.
 */
export interface IEvent{
    readonly eventName: string;
    readonly data?: any;
}