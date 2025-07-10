// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CommonEvents } from "../../../Script/Event/CommonEvents";
import EventBus from "../../../Script/Event/EventBus";
import { UIEvents } from "../../../Script/Event/UIEvents";
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
    _Logger:Logger = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(!this._Logger) {
            cc.error("LoginMenu: Logger is not assigned. Please assign a Logger instance to the _Logger property.");
            return;
        }

        if (!this.usernameInput || !this.passwordInput || !this.loginButton || !this.registerButton || !this.forgotPasswordButton) {
            this._Logger.Log("One or more UI components are not assigned in the LoginMenu script.", this); 
            return;
        }

        this.loginButton.node.on('click', this.onLoginButtonClicked, this);
        this.registerButton.node.on('click', this.onRegisterButtonClicked, this);
        this.forgotPasswordButton.node.on('click', this.onForgotPasswordButtonClicked, this);

    }

    onLoginButtonClicked() {
        //Handle login logic here
        EventBus.Instance.Notify({ eventName: UIEvents.ButtonClick, data: null });
        
        const usernameInput = this.usernameInput.string;
        const passwordInput = this.passwordInput.string;
        
        // for now just simplify login logic
        if (usernameInput && passwordInput) {
            this.loginLogic(usernameInput, passwordInput);
        } else {
            this._Logger.Log("Username or Password cannot be empty.",this);
        }
    }
    onRegisterButtonClicked() {

    }
    onForgotPasswordButtonClicked() {

    }

    loginLogic(usernameInput: string, passwordInput: string) {
        this._Logger.Log("Login logic executed with username: " + usernameInput + " and password: " + passwordInput, this);    
    }

    // update (dt) {}
}
