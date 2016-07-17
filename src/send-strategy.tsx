/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";

export interface ISendStrategyProps {
}

export interface ISendStrategyState {
    strategyCode?: string;
    statusMessage?: string;
    token?: string;
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
        function codeToMessage(code: number) {
            switch (code) {
                case 200: return "Sended.";
                case 400: return "Bad request.";
                case 500: return "Internal server error.";
                default: return "Unexpected server error.";
            }
        }
        fetch(endpoint + "strategies", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            body: JSON.stringify({
                source: this.state.strategyCode,
            })
        })
            .then(response => {
                this.setState({ statusMessage: codeToMessage(response.status) });
                return response.json()
            })
            .then(data => {
                console.log(data.message);
            });
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
                {this.state.statusMessage}
            </div>
        );
    }
}
