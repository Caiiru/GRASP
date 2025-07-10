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
export default class MenuController extends cc.Component {

    private _eventBus: EventBus = null; 

    @property(cc.Node)
    loginScreen: cc.Node = null;   
    @property(cc.Node)
    mainMenuScreen:cc.Node = null;

    @property
    CurrentState: MainMenuState = MainMenuState.None;
 
    async start() { 
        await(this.bindObjects());

        this.changeState(MainMenuState.Loading);
        this._eventBus = EventBus.Instance;
        if (!this._eventBus) {
            cc.error("EventBus instance is not initialized. Please ensure it is created before using it.");
            return;
        }
        this._eventBus.Subscribe(CommonEvents.GameFirstLoad, this.onGameFirstLoad, this);

    }

    onGameFirstLoad(){
        this.changeState(MainMenuState.Login);
    }

    changeState(newState: MainMenuState) {
        if (this.CurrentState === newState) {
            cc.log("State is already " + MainMenuState[newState]);
            return;
        }       
        this.CurrentState = newState;
        this.handleCurrentState();
    }

    handleCurrentState(){
        switch (this.CurrentState) {
            case MainMenuState.Loading:
                this.loginScreen.active = false;
                this.mainMenuScreen.active = false;
                cc.log("Loading state");
                break;
            case MainMenuState.Login:
                this.loginScreen.active = true;
                this.mainMenuScreen.active = false;
                cc.log("Login state");
                break;
            case MainMenuState.Main:
                this.loginScreen.active = false;
                this.mainMenuScreen.active = true;
                cc.log("Main Menu state");
                break;
            default:
                cc.error("Unhandled state: " + MainMenuState[this.CurrentState]);
        }
    }

    async bindObjects(){
        if(this.loginScreen == null || this.mainMenuScreen == null){
            cc.error("MainMenu: bindObjects - One or more UI components are not assigned in the MainMenu script.");
            return;
        }
    }
}

enum MainMenuState{
    None = 0,
    Loading = 1, 
    Login = 2,
    Register = 3,
    Main = 4,
    Game = 5,
    Create=6,
}