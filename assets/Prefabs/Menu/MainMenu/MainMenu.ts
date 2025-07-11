/**
 * MainMenu class
 * 
 * Gerencia o menu principal da aplicação, incluindo a verificação e o binding dos botões de UI.
 * Usa o EventBus para notificar eventos de clique nos botões.
 * Exibe mensagens de log para auxiliar no debug de componentes não atribuídos.
 */

import EventBus from "../../../Script/Event/EventBus";
import { IEvent } from "../../../Script/Event/IEvent";
import Logger from "../../../Script/Utils/Logger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component {

    // Logger para mensagens de debug
    @property(cc.Node)
    logger: Logger = null;

    // Referências aos botões da UI
    @property(cc.Button)
    HostButton:cc.Button = null;
    @property(cc.Button)
    JoinButton:cc.Button = null;
    @property(cc.Button)
    CreateButton:cc.Button=null;
    @property(cc.Button)
    EditProfileButton:cc.Button = null;
    @property(cc.Label)
    UsernameLabel:cc.Label = null;

    /**
     * onLoad
     * Inicializa o menu principal e verifica se o logger está atribuído.
     */
    onLoad () {
        this.logger = this.logger.getComponent(Logger);
        
        if(!this.logger){
            cc.error("MainMenu: Logger is not assigned.");
            return;
        }
        this.checkObjects();
    }

    /**
     * checkObjects
     * Verifica se todos os componentes de UI estão atribuídos.
     * Faz log de erro se algum estiver faltando, ou prossegue para o binding dos botões.
     */
    checkObjects(){
        if (!this.HostButton || !this.JoinButton || !this.CreateButton || !this.EditProfileButton || !this.UsernameLabel) {
            this.logger.Log("One or more UI components are not assigned in the MainMenu script.", this); 
            return;
        }
        this.logger.Log("All UI components are assigned correctly.", this);
        this.bindObjects();
    }

    /**
     * bindObjects
     * Associa os eventos de clique dos botões às funções correspondentes.
     */
    bindObjects(){
        this.HostButton.node.on('click', this.createButtonClicked(this.onHostButtonClicked), this);
        this.JoinButton.node.on('click', this.createButtonClicked(this.onJoinButtonClicked), this);
        this.CreateButton.node.on('click', this.createButtonClicked(this.onCreateButtonClicked), this);
        this.EditProfileButton.node.on('click', this.createButtonClicked(this.onEditProfileButtonClicked), this);
        this.testBind();
    } 

    /**
     * createButtonClicked
     * Retorna uma função que notifica o EventBus e executa a ação específica do botão.
     * @param specificAction Função a ser chamada após a notificação do clique
     */
    private createButtonClicked(specificAction:Function){
        return (event:IEvent)=>{
            EventBus.Instance.Notify({ eventName: "UI_BUTTON_CLICK", data:null});
            specificAction.call(this,event);
        }
    }

    /**
     * onHostButtonClicked
     * Handler para o clique no botão Host.
     */
    onHostButtonClicked(){ 
    }

    /**
     * onJoinButtonClicked
     * Handler para o clique no botão Join.
     */
    onJoinButtonClicked(){ 
    }

    /**
     * onCreateButtonClicked
     * Handler para o clique no botão Create.
     */
    onCreateButtonClicked(){ 
    }

    /**
     * onEditProfileButtonClicked
     * Handler para o clique no botão Edit Profile.
     */
    onEditProfileButtonClicked(){ 

    }

    // update (dt) {}


    testBind(){
        EventBus.Instance.Subscribe("UI_BUTTON_CLICK", this.LogMessage, this); 
    }
     

    LogMessage(message:string){
        if(!this.logger) return;

        this.logger.Log(message,this);
    }
}
