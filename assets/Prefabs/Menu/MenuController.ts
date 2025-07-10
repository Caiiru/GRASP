// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventBus from "../../Script/Event/EventBus";
import { InitializeEvents } from "../../Script/Event/EventsEnums/InitializeEvents";
import { LoginEvents } from "../../Script/Event/EventsEnums/LoginEvents";
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


    }
    /**
     * Initialize the MainMenuController.
     * This method binds all necessary objects and events, sets the initial state to Loading,
     * and updates the loading bar progress.
     * @returns {Promise<boolean>} - Returns true if initialization is successful.
     */

    public async Initialize(): Promise<boolean> {

        await (this.BindObjects());
        this.ChangeState(MainMenuState.Loading);
        await (this.BindEvents());

        this.SetLoadingBarProgress(1);
        await new Promise(resolve => setTimeout(resolve, 1000));  
        return true;
    }
    OnGameFirstLoad() {
        this.Log("Game first load event received. Changing state to Login.");

        //this.loadingScreen.getComponent(MenuLoadingBar).UpdateProgress(1);
        this.ChangeState(MainMenuState.Login);
    }

    ChangeState(newState: MainMenuState) {
        if (this.CurrentState === newState) {
            this.Log("State is already " + MainMenuState[newState]);
            return;
        }
        this.CurrentState = newState;
        this.HandleCurrentState();
    }

    /*
        Desactive all screens and activate the current state screen.
        This method is called whenever the state changes.
        It ensures that only the relevant screen is active based on the current state.
        It also logs the current state for debugging purposes.
    */
    HandleCurrentState() {
        this.DesactivateAllScreens();

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

    DesactivateAllScreens() {
        this.loadingScreen.active = false;
        this.loginScreen.active = false;
        this.mainMenuScreen.active = false;
    }
    async BindObjects() {

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
    async BindEvents() {

        this._eventBus.Subscribe(InitializeEvents.GameFirstLoad, () => {
            this.OnGameFirstLoad();
        }, this);

        this.SetLoadingBarProgress(0.3);

        await (this.BindLoginEvents());
    }

    async BindLoginEvents() {
        this._eventBus.Subscribe(LoginEvents.UserLoginSuccess, () => {
            this.Log("User logged in successfully. Changing state to Main Menu.");
            this.ChangeState(MainMenuState.Main);
        }, this);

        this.SetLoadingBarProgress(0.6);

    }

    /**
     * SetLoadingBarProgress
     * This method is used to update the loading bar progress.
     * It notifies the EventBus with the new progress value.
     * @param value as number - The new progress value, should be between 0 and 1.
     */
    SetLoadingBarProgress(value: number) {

        this._eventBus.Notify({
            eventName: InitializeEvents.GameLoadingProgress,
            data: value as number
        });
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