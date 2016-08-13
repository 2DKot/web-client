/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import request from './fetch-wrapper'
import Snackbar from 'material-ui/Snackbar'

export interface ISendStrategyProps {
}

export interface ISendStrategyState {
    strategyCode?: string;
    statusMessage?: string;
    token?: string;
    successMessage?: boolean;
}

export class SendStrategy extends React.Component<ISendStrategyProps, ISendStrategyState> {
    constructor(props: ISendStrategyProps) {
        super(props);
        this.state = {token: localStorage.getItem('token')};
    }

    handleStrategyCode(e) {
        this.setState({ strategyCode: e.target.value });
    }
    
    handleFile(e) {
        var file: File = e.target.files[0];
        if(file.size > 100000) {
            this.setState({statusMessage: "File too big!"});
            return;
        }
        console.log(file.type)
        var reader = new FileReader();
        reader.onloadend = (e) => {
            var code = reader.result;
            this.setState({strategyCode: code});
        };
        reader.readAsText(file);      
    }
    
    handleSubmit() {
        request('strategies', 'post', {
            source: this.state.strategyCode
        }).then(data => {
            console.log(data.message);
            this.setState({successMessage: true})
        });
    }

    closeSuccessMessage = () => {
        this.setState({ successMessage: false })
    }

    render() {
        return (
            <div>
                <TextField
                    hintText = "Copy your code here, or load file by button below."
                    value={this.state.strategyCode}                 
                    onChange={e=> this.handleStrategyCode(e) }
                    multiLine={true}
                    fullWidth={true}
                    rowsMax={20}
                /><br/>
                <input
                    type = "file"               
                    onChange={e=> this.handleFile(e) }
                /><br/>
                <RaisedButton
                    label='Send'
                    onClick={e=> this.handleSubmit() }
                /><br/>
                <Snackbar
                    message='Strategy sended to compilation.'
                    open={this.state.successMessage}
                    onRequestClose={this.closeSuccessMessage}
                    autoHideDuration={2000}
                />
            </div>
        );
    }
}
