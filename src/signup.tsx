/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import TextField from 'material-ui/TextField'
import Subheader from 'material-ui/Subheader'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";

export interface ISignupProps {
    onSignup()
}

export interface ISignupState {
    username?: string,
    fullname?: string;
    password?: string,
    passwordDuplicate?: string,
    email?: string,
    duplicatePasswordError?: boolean,
    statusMessage?: string,
    alreadyExists?: string
}

export default class Signup extends React.Component<ISignupProps, ISignupState> {
    constructor(props: ISignupProps) {
        super(props);
        this.state = {};
    }
    handleName(e) {
        this.setState({ username: e.target.value });
    }
    handleFullname(e) {
        this.setState({ fullname: e.target.value });
    }
    handlePassword(e) {
        this.setState({ password: e.target.value }, this.matchPasswords);
    }
    handlePasswordDuplicate(e) {
        this.setState({ passwordDuplicate: e.target.value }, this.matchPasswords);
    }
    matchPasswords() {
        if(this.state.password !== this.state.passwordDuplicate) {
            this.setState({duplicatePasswordError: true});
        }
        else {
            this.setState({duplicatePasswordError: false});
        }
    }
    handleEmail(e) {
        this.setState({ email: e.target.value });
    }
    handleSubmit(){
        if(this.state.password != this.state.passwordDuplicate) {
            return;
        }
        fetch(endpoint + "users", {
            method: 'post',
            headers: {
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                fullname: this.state.fullname
            })
        })
        .then(response => {
            if(response.status === 201) {
                this.props.onSignup();
            } else if(response.status === 409) {
                response.json().then((data) => {
                    console.log('!!!!')
                    console.log(data)
                    this.setState({ alreadyExists: data.alreadyExists })
                });
            }
        })
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
                    hintText = "login"
                    value={this.state.username}
                    onChange={e=>this.handleName(e)}
                    fullWidth={true}
                    errorText={this.state.alreadyExists == 'username' ?
                        'There is already user with that login':null}
                /><br/>
                <TextField
                    hintText = "full name"
                    value={this.state.fullname}
                    onChange={e=>this.handleFullname(e)}
                    fullWidth={true}
                /><br/>
                <TextField
                    type="password"
                    hintText = "password"
                    value={this.state.password}
                    onChange={e=>this.handlePassword(e)}
                    fullWidth={true}
                /><br/>
                <TextField
                    type="password"
                    hintText="password again"
                    value={this.state.passwordDuplicate}
                    onChange={e=>this.handlePasswordDuplicate(e)}
                    fullWidth={true}
                    errorText={this.state.duplicatePasswordError ? 
                        "Passwords doesn't match!" : null}
                /><br/>
                <TextField
                    hintText="your@mail.com"
                    value={this.state.email}
                    onChange={e=>this.handleEmail(e)}
                    fullWidth={true}
                    errorText={this.state.alreadyExists == 'email' ?
                        'There is already user with that email': null}
                /><br/>
                <RaisedButton 
                    label='sign up'
                    onClick={e=>this.handleSubmit()}
                />
                {this.state.statusMessage}
            </Paper>
        );
    }
}