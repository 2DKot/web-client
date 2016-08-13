/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import {IUser} from './IUser';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import request from './fetch-wrapper'

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
            ajaxLoading: false,
            successMessage: false
        }
    }

    handleFullname(e) {
        this.setState({fullname: e.target.value})
    }

    changeFullname(e) {
        this.setState({ ajaxLoading: true })
        var token = localStorage.getItem('token');
        request('users/' + this.props.me._id, 'put', {
            fullname: this.state.fullname
        }).then(data => {
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
                <RefreshIndicator 
                    status={this.state.ajaxLoading ? 'loading' : 'hide'}
                    style={{
                        position: 'relative'
                    }}
                    left={0}
                    top={0}
                />
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
