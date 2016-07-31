/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import TextField from 'material-ui/TextField'
import Subheader from 'material-ui/Subheader'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";

function base64encode(str) {
    //from http://www.manhunter.ru/webmaster/423_funkcii_base64_na_javascript.html
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg'+
                   'hijklmnopqrstuvwxyz0123456789+/=';
    var b64encoded = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
 
    for (var i=0; i<str.length;) {
        chr1 = str.charCodeAt(i++);
        chr2 = str.charCodeAt(i++);
        chr3 = str.charCodeAt(i++);
 
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
 
        enc3 = isNaN(chr2) ? 64:(((chr2 & 15) << 2) | (chr3 >> 6));
        enc4 = isNaN(chr3) ? 64:(chr3 & 63);
 
        b64encoded += b64chars.charAt(enc1) + b64chars.charAt(enc2) +
                      b64chars.charAt(enc3) + b64chars.charAt(enc4);
    }
    return b64encoded;
}

export interface ILoginProps {
    onLogin():void;
}

export interface ILoginState {
    username?: string,
    password?: string,
    invalidPasswordMessage?: boolean
}

export default class Login extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = { username:"", password: "", invalidPasswordMessage: false };
    }
    handleName(e){
        this.setState({ username: e.target.value, invalidPasswordMessage: false });
    }
    handlePassword(e){
        this.setState({ password: e.target.value, invalidPasswordMessage: false });
    }
    checkStatus(response) {
        console.log(response);
        if (response.status >= 200 && response.status < 300 && response.ok) {
            return response;
        } else {
            if(response.status == 401) {
                this.setState({ invalidPasswordMessage: true });
            } else {
                throw new Error(response.statusText);
            }
            return response;
        }
    }
    authorize() {
        if(!this.state.password || !this.state.username || this.state.invalidPasswordMessage) {
            return;
        }
        var parseJSON = function(response) {
            return response.json()
        }
        var authString = 'Basic ' + base64encode('superID:superSecret');
        var bodyString = 'grant_type=password&username='+this.state.username+'&password='+this.state.password;
        fetch(endpoint + 'oauth/token/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': authString
            },
            body: bodyString
        })
            .then(resp => this.checkStatus(resp))
            .then(parseJSON)
            .then(data => {
                console.log(data);
                localStorage.setItem("token", data.access_token);
                this.props.onLogin();
            })
            .catch(ex => {
                console.log('request failed: ', ex);
            });
    }

    handleKeyDown(e) {
        if(e.keyCode == 13) {
            this.authorize();
        }
    }

    render() {
        return (
            <Paper
                zDepth={2}
                style={{
                    display: 'block',
                    padding: '10px'
                }}
            >
                <TextField 
                    onChange={e => this.handleName(e)}
                    value={this.state.username}
                    hintText="username"
                    fullWidth={true}
                    onKeyDown={(e)=>this.handleKeyDown(e)}
                />
                <TextField 
                    onChange={e => this.handlePassword(e)}
                    value={this.state.password}
                    hintText="password"
                    type="password"
                    fullWidth={true}
                    onKeyDown={(e)=>this.handleKeyDown(e)}
                    errorText={this.state.invalidPasswordMessage ? 
                        "Invalid login or password":
                        null}
                /><br/>
                <RaisedButton 
                    label='login'
                    onClick={e=>this.authorize()}
                />
            </Paper>
        );
    }
}