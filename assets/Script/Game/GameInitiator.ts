
import MenuController from "../../Prefabs/Menu/MenuController";
import EventBus from "../Event/EventBus";
import { InitializeEvents } from "../Event/EventsEnums/InitializeEvents";

const { ccclass, property } = cc._decorator;


@ccclass
export default class GameInitiator extends cc.Component {

    //#region "Properties"
    @property(cc.Prefab)
    public ui_RootPrefab: cc.Node = null;
    @property(cc.Prefab)
    public ui_loadingCanvasPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public mainMenuPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public eventBusPrefab: cc.Node = null;

    //#endregion

    //#region "Initialized Objects"
    /**
     * The root node of the game, where all UI and game objects will be attached.
     * This is instantiated from the uiRoot prefab.
    */

    private _rootCanvas: cc.Node = null;

    private _eventBus: EventBus = null; // EventBus instance, type can be adjusted based on actual implementation
    private _mainMenu: MenuController = null;

    //#endregion

    async start() {
        //create instance of EventBus



        await this.BindObjects();

        await this.InitializeGame();

    }

    private async BindObjects() {
        // Bind all objects that need to be initialized  

        //wait 2 seconds to simulate loading time 
        // await new Promise(resolve => setTimeout(resolve, 2000));

        const eventBusNode = cc.instantiate(this.eventBusPrefab);
        eventBusNode.name = "EventBus";
        eventBusNode.parent = cc.find("GameRoot");
        this._eventBus = eventBusNode.getComponent("EventBus");




        // Initialize the game root node
        this._rootCanvas = cc.instantiate(this.ui_RootPrefab);
        this._rootCanvas.name = "CanvasRoot";
        this._rootCanvas.parent = cc.find("GameRoot");
        this._rootCanvas.setPosition(cc.v2(480, 320));


    }

    async InitializeGame(): Promise<void> {

        // Initialize game logic, load resources, etc. 
        const mainMenuObject = cc.instantiate(this.mainMenuPrefab);
        mainMenuObject.name = "MainMenu";
        mainMenuObject.parent = this._rootCanvas;
        mainMenuObject.setPosition(cc.v2(0, 0));
        mainMenuObject.active = true;
        this._mainMenu = mainMenuObject.getComponent("MenuController");
        // Initialize the main menu
        await this._mainMenu.Initialize().then(() => {
            
            this._eventBus.Notify({
                eventName: InitializeEvents.GameFirstLoad,
                data: null
            });
        });
        // Notify that the game has been initialized

    }
}
