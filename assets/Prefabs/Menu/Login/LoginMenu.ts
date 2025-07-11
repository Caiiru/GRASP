// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventBus from "../../../Script/Event/EventBus";
import { LoginEvents } from "../../../Script/Event/EventsEnums/LoginEvents";
import { IEvent } from "../../../Script/Event/IEvent";
import Logger from "../../../Script/Utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginMenu extends cc.Component {

    @property(cc.EditBox)
    usernameInput: cc.EditBox = null;
    @property(cc.EditBox)
    passwordInput: cc.EditBox = null;
    @property(cc.Button)
    loginButton: cc.Button = null;
    @property(cc.Button)
    registerButton: cc.Button = null;
    @property(cc.Button)
    forgotPasswordButton: cc.Button = null;


    @property(cc.Node)
    logger: Logger = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bindObjects();
        this.bindClicks();
    }
    bindObjects() {

        this.logger = this.logger.getComponent(Logger);

        if (!this.logger) {
            cc.error("LoginMenu: Logger is not assigned. Please assign a Logger instance to the _Logger property.");
            return;
        }

        if (!this.usernameInput || !this.passwordInput || !this.loginButton || !this.registerButton || !this.forgotPasswordButton) {
            this.LogMessage("One or more UI components are not assigned in the LoginMenu script.");
            return;
        }
    }

    bindClicks() {
        this.loginButton.node.on('click',
            this.handleButtonClick(this.onLoginButtonClicked),
            this);

        this.registerButton.node.on('click',
            this.handleButtonClick(this.onRegisterButtonClicked),
            this);

        this.forgotPasswordButton.node.on('click',
            this.handleButtonClick(this.onForgotPasswordButtonClicked),
            this);

    }

    /**
         * createButtonClicked
         * Retorna uma função que notifica o EventBus e executa a ação específica do botão.
         * @param specificAction Função a ser chamada após a notificação do clique
         */
    private handleButtonClick(specificAction: Function) {
        return (event: IEvent) => {
            EventBus.Instance.Notify({ eventName: "UI_BUTTON_CLICK", data: null });
            specificAction.call(this, event);
        }
    }

    onLoginButtonClicked() {
        //Handle login logic here

        this.TryToLogin();




    }
    onRegisterButtonClicked() {

    }
    onForgotPasswordButtonClicked() {

    }
    /**
     * TryToLogin
     * This method is called when the user attempts to log in.
     * It notifies the EventBus and handles the login logic.
     */
    async TryToLogin() {
        EventBus.Instance.Notify({ eventName: LoginEvents.UserTryingToLogin, data: null });
        const loginSuccess = await this.HandleLoginLogic();

        if (loginSuccess) {
            this.LogMessage("Login successful!");
            EventBus.Instance.Notify({ eventName: LoginEvents.UserLoginSuccess, data: null });
        } else {
            this.LogMessage("Login failed. Please check your credentials.");
            EventBus.Instance.Notify({ eventName: LoginEvents.UserLoginFailure, data: null });
        }
    }
    /**
     * HandleLoginLogic
     * This method handles the login logic, such as validating the username and password.
     * Returns true if login is successful, false otherwise.
     */
    HandleLoginLogic():boolean {


        const usernameInput = this.usernameInput.string;
        const passwordInput = this.passwordInput.string;

        if (!usernameInput || !passwordInput) {
            this.LogMessage("Username and Password cannot be empty.");
            return false;
        }


        this.LogMessage("Login logic executed with username: " + usernameInput + " and password: " + passwordInput);
        return true;
    }

    LogMessage(message: string) {
        if (!this.logger) return;


        this.logger.Log(message, this);
    } 
}
