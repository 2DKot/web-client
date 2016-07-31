/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';
import {IStrategy} from './IStrategy'
import {UserMini} from './UserMini';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import {StrategyRow} from './strategy-row'

var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";

interface IStrategiesListProps {
}

interface IStrategiesListState {
    strategies?: IStrategy[];
}

export class StrategiesList extends React.Component<IStrategiesListProps, IStrategiesListState> {
    constructor(props: IStrategiesListProps) {
        super(props);
        this.state = { strategies: [] };
    }

    componentDidMount(){
        this.refresh();
    }
    
    refresh() {
        fetch(endpoint + "strategies", {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                this.setState({ strategies: data.strategies });
            });
    }
    
    // POST doesn't save type of date and JS think, that it's string!
    // TODO: Need to solve this later!
    formatDate(rawDate: any) {
        var d = new Date(rawDate);
        return d.getHours() + ":" + d.getMinutes() + " "
            + d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
    }
    
    render() {
        var strategies = this.state.strategies.map(((strategy) =>
            <StrategyRow strategy={strategy} key = {strategy._id}/>
        ));
        return (
            <div>
                <h3>There are ({this.state.strategies.length}) strategies</h3>
                <button
                    onClick = {() => this.refresh() }
                    > Refresh </button>
                <Table>
                    <TableHeader 
                        displaySelectAll={false} 
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Status</TableHeaderColumn>
                            <TableHeaderColumn>Source</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {strategies}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
