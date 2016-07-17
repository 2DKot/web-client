/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import {IUser} from './IUser';
import TextField from 'material-ui/TextField'
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

export interface IProfileProps {
    me: IUser
    updateUser(user:IUser):void
}

export interface IProfileState {
    editName?: boolean
    fullname?: string
}

export default class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            fullname: this.props.me.fullname, 
            editName: this.props.me.fullname ? false : true
        }
    }

    handleFullname(e) {
        this.setState({fullname: e.target.value})
    }

    changeFullname(e) {
        var token = localStorage.getItem('token');
        fetch(endpoint + "users/" + this.props.me._id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                fullname: this.state.fullname
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            this.props.updateUser(data.user);
        });
    }

    render() {
        return (
            <div>
                {this.props.me.avatar ?
                    <img src={"data:image/png;base64,"+this.props.me.avatar.dataBase64}/>
                :
                    <img src=""/>
                } 
                <TextField
                    hintText = "full name"
                    value={this.state.fullname}
                    onChange={e=>this.handleFullname(e)}
                    fullWidth={true}
                    onBlur={e=>this.changeFullname(e)}
                />
            </div>
        );
    }
}
