/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';

var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";

export interface ISendStrategyProps {
    token: string;
}

export interface ISendStrategyState {
    strategyCode?: string;
    statusMessage?: string;
}

export class SendStrategy extends React.Component<ISendStrategyProps, ISendStrategyState> {
    constructor(props: ISendStrategyProps) {
        super(props);
        this.state = {};
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
                'Authorization': 'Bearer ' + this.props.token
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
                <textarea
                    placeholder = "Copy your code here, or load file by button below."
                    value={this.state.strategyCode}                 
                    onChange={e=> this.handleStrategyCode(e) }
                /><br/>
                <input
                    type = "file"               
                    onChange={e=> this.handleFile(e) }
                /><br/>
                <button onClick={e=> this.handleSubmit() }>Send</button><br/>
                {this.state.statusMessage}
                </div>
        );
    }
}
