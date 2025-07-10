// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
 
import EventBus from "../../Script/Event/EventBus"; 
import { InitializeEvents } from "../../Script/Event/EventsEnums/InitializeEvents";
import Logger from "../../Script/Utils/Logger";
import MenuLoadingBar from "./MainMenu/LoadingBar/MenuLoadingBar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuController extends cc.Component {

    private _eventBus: EventBus = null;

    @property
    CurrentState: MainMenuState = null

    @property(cc.Node)
    loadingScreen: cc.Node = null;

    @property(cc.Node)
    loginScreen: cc.Node = null;
    @property(cc.Node)
    mainMenuScreen: cc.Node = null;


    @property(cc.Node)
    logger: Logger = null;

    async start() {

        await (this.bindObjects());
        this.changeState(MainMenuState.Loading);
        await (this.bindEvents());

    }

    onGameFirstLoad() {
        this.Log("Game first load event received. Changing state to Login.");

        this.loadingScreen.getComponent(MenuLoadingBar).UpdateProgress(1);
        this.changeState(MainMenuState.Login);
    }

    changeState(newState: MainMenuState) {
        if (this.CurrentState === newState) {
            this.Log("State is already " + MainMenuState[newState]);
            return;
        }
        this.CurrentState = newState;
        this.handleCurrentState();
    }

    /*
        Desactive all screens and activate the current state screen.
        This method is called whenever the state changes.
        It ensures that only the relevant screen is active based on the current state.
        It also logs the current state for debugging purposes.
    */
    handleCurrentState() {
        this.desactivateAllScreens();

        switch (this.CurrentState) {
            case MainMenuState.Loading:
                this.loadingScreen.active = true; 
                this.Log("Loading state");
                break;
            case MainMenuState.Login: 
                this.loginScreen.active = true; 
                this.Log("Login state");
                break;
            case MainMenuState.Main: 
                this.mainMenuScreen.active = true;
                this.Log("Main Menu state");
                break;
            default:
                this.Log("Unhandled state: " + MainMenuState[this.CurrentState]);
        }
    }

    desactivateAllScreens() {
        this.loadingScreen.active=false;
        this.loginScreen.active = false;
        this.mainMenuScreen.active = false;
    }

    async bindEvents() {

        this._eventBus.Subscribe(InitializeEvents.GameFirstLoad, () => {
            this.onGameFirstLoad();
        }, this);

        this.loadingScreen.getComponent(MenuLoadingBar).UpdateProgress(0.3);
    }

    async bindObjects() {

        this.logger = this.logger.getComponent(Logger);
        this._eventBus = EventBus.Instance;
        this.loadingScreen.getComponent(MenuLoadingBar).Initialize();


        if (!this.logger) {
            cc.error("MainMenu: Logger is not assigned. Please assign a Logger instance to the logger property.");
            return;
        }
        if (this.loginScreen == null || this.mainMenuScreen == null || this.loadingScreen == null) {
            cc.error("MainMenu: bindObjects - One or more UI components are not assigned in the MainMenu script.");
            return;
        }
        if (!this._eventBus) {
            this.Log("EventBus instance is not initialized. Please ensure it is created before using it.");
            return;
        }

    }


    Log(message: string) {
        if (!this.logger) return;
        this.logger.Log(message, this);

    }
}

enum MainMenuState {
    Loading = 1,
    Login = 2,
    Register = 3,
    Main = 4,
    Game = 5,
    Create = 6,
}