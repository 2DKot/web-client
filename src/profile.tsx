/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import {IUser} from './IUser';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import Loader from './loader'
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
    updateError?: boolean
    ajaxLoading?: boolean
    successMessage?: boolean
}

export default class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            fullname: this.props.me.fullname, 
            editName: this.props.me.fullname ? false : true,
            updateError: false,
            ajaxLoading: false
        }
    }

    handleFullname(e) {
        this.setState({fullname: e.target.value})
    }

    changeFullname(e) {
        this.setState({ ajaxLoading: true })
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
            if(response.ok) {
                return response.json();
            }
        })
        .then(data => {
            console.log(data.message);
            this.props.updateUser(data.user);
            this.setState({ successMessage: true })
        }).catch(err => {
            this.setState({ updateError: true })
        });
        this.setState({ ajaxLoading: false });
    }

    handleTryUpdateAgain() {
        this.setState({ updateError: false })
        this.changeFullname(null);
    }

    closeSuccessMessage = () => {
        this.setState({ successMessage: false })
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
                <Loader show={this.state.ajaxLoading}/>
                {this.state.updateError ?
                    <div>
                        <label
                            style={{ color: 'red' }}
                        >
                            Failed to update profile!
                        </label><br/>
                        <RaisedButton
                            label="Try update profile again"
                            primary={true}
                            onTouchTap={e=>this.handleTryUpdateAgain()}
                        />
                    </div>: null}
                <Snackbar
                    message='Profile successfuly updated'
                    open={this.state.successMessage}
                    onRequestClose={this.closeSuccessMessage}
                    autoHideDuration={2000}
                />
            </div>
        );
    }
}
