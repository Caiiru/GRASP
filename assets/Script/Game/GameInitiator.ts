 const { ccclass, property } = cc._decorator;


@ccclass
export default class GameInitiator extends cc.Component {
 
    @property(cc.Prefab)
    public mainCamera = null;
    @property(cc.Prefab)
    public uiRoot: cc.Node = null;
    @property(cc.Prefab)
    public eventBus:cc.Node = null;



    async start() {
        this.BindObjects();

        await this.InitializeGame();
        
    }

    private BindObjects(): void {
        // Bind all objects that need to be initialized 
        //create instance of main camera
        const cameraNode = cc.instantiate(this.mainCamera);
        cameraNode.name = "Main Camera";
        cameraNode.parent = cc.find("GameRoot"); 
        
        //create instance of UI Root
        const uiRootNode = cc.instantiate(this.uiRoot);
        uiRootNode.name = "UI Root";
        uiRootNode.parent = cc.find("GameRoot");
        uiRootNode.setPosition(cc.v2(480, 320));
        
        //create instance of EventBus
        const eventBusNode = cc.instantiate(this.eventBus);
        eventBusNode.name = "EventBus";
        eventBusNode.parent = cc.find("GameRoot");
 

    } 

    async InitializeGame(): Promise<void> {

        // Initialize game logic, load resources, etc.
        // This method can be extended to include more complex initialization logic.

        console.log("Game Initialized");
    }
}
