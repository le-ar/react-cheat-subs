import { Component } from "react";
import React from "react";
import { Button } from "@shopify/polaris";

declare var uLogin: any;

export default class AuthPage extends Component {
    componentDidMount() {
        let script = document.createElement("script");
        script.src = '//ulogin.ru/js/ulogin.js';
        document.body.appendChild(script);
    }

    handleAuth() {
        uLogin.customInit('uLogin');
        (document.getElementById('uLogin')?.getElementsByClassName('ulogin-button-vkontakte')[0] as any).click();
    }

    render() {
        return <div>
            <div>
                <Button onClick={() => {this.handleAuth()}}>Авторизоваться</Button>
            </div>
            <div className="d-none">
                <div id="uLogin" data-ulogin="display=small;theme=classic;fields=first_name,last_name;providers=vkontakte;hidden=;redirect_uri=http%3A%2F%2Flocalhost;mobilebuttons=0;"></div>
            </div>
        </div>;
    }
}