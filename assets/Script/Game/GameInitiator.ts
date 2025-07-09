import Timer from "../Auxliar/Timer";
import { CommonEvents } from "../Event/CommonEvents";
import EventBus from "../Event/EventBus";

 const { ccclass, property } = cc._decorator;


@ccclass
export default class GameInitiator extends cc.Component {
    
    //#region "Properties"
    @property(cc.Prefab)
    public ui_RootPrefab: cc.Node = null;
    @property(cc.Prefab)
    public ui_splashScreenPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public ui_loadingCanvasPrefab: cc.Prefab = null; 
    @property(cc.Prefab)
    public mainMenuPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public eventBusPrefab: cc.Node = null;

    @property
    private next: Timer = null;

    //#endregion

    //#region "Initialized Objects"
    /**
     * The root node of the game, where all UI and game objects will be attached.
     * This is instantiated from the uiRoot prefab.
    */
    
    private _rootCanvas: cc.Node = null;
    private _progressBarNode: cc.Node = null;

    private _eventBus: EventBus = null; // EventBus instance, type can be adjusted based on actual implementation
    private _mainMenu: cc.Node = null;

    //#endregion

    async start() {
        //create instance of EventBus
        const eventBusNode = cc.instantiate(this.eventBusPrefab);
        eventBusNode.name = "EventBus";
        eventBusNode.parent = cc.find("GameRoot");
        this._eventBus = eventBusNode.getComponent("EventBus");

        


        // Initialize the game root node
        this._rootCanvas = cc.instantiate(this.ui_RootPrefab);
        this._rootCanvas.name = "CanvasRoot"; 
        this._rootCanvas.parent = cc.find("GameRoot");
        this._rootCanvas.setPosition(cc.v2(480, 320)); 
        
        // Initialize the splash screen
         
        const splashScreen = cc.instantiate(this.ui_splashScreenPrefab);
        splashScreen.name = "SplashScreen";
        splashScreen.parent = this._rootCanvas;
        splashScreen.setPosition(cc.v2(0, 0)); 


        // Initialize the loading canvas with a progress bar
        this._progressBarNode = cc.instantiate(this.ui_loadingCanvasPrefab);
        this._progressBarNode.name = "LoadingCanvas";
        this._progressBarNode.parent = this._rootCanvas;
        this._progressBarNode.setPosition(cc.v2(0, -120)); 
        this._progressBarNode.getComponentInChildren(cc.Label).string = "Loading...";
        this._progressBarNode.getComponentInChildren(cc.ProgressBar).progress = 0;

        //Test
        this.next = new Timer("Next", 5);

        await this.BindObjects();

        await this.InitializeGame();
        
    }

    private async BindObjects() {
        // Bind all objects that need to be initialized  

        //wait 2 seconds to simulate loading time 
        // await new Promise(resolve => setTimeout(resolve, 2000));

        this._progressBarNode.getComponentInChildren(cc.ProgressBar).progress = 0.3;
        
        
        this._progressBarNode.getComponentInChildren(cc.ProgressBar).progress = 0.6;
        // await new Promise(resolve => setTimeout(resolve, 2000));

    } 

    async InitializeGame(): Promise<void> {

        // Initialize game logic, load resources, etc. 

        this._mainMenu = cc.instantiate(this.mainMenuPrefab);
        this._mainMenu.name = "MainMenu";
        this._mainMenu.parent = this._rootCanvas;
        this._mainMenu.setPosition(cc.v2(0, -120));
        this._mainMenu.active = false;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        this._progressBarNode.getComponentInChildren(cc.ProgressBar).progress = 1;
        console.log("Game Initialized");  
        this._progressBarNode.destroy(); // Remove the loading canvas after initialization
        this._mainMenu.active = true;

        this._eventBus.Subscribe("Timer", this.ShowTimerMensagem);

        await new Promise(resolve => setTimeout(resolve, 1000));
        this._eventBus.Notify({
            eventName: CommonEvents.GameFirstLoad,
            data: this});
    }

    async update()
    {
        this._eventBus.Notify({eventName: "Timer", data: this});
    }

    public ShowTimerMensagem(timer: Timer) {
        this.next = null;
        console.log("Timer = " + timer.timerName);
    }

}
