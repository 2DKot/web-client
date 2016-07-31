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
import injectTapEventPlugin = require('react-tap-event-plugin');
import IconButton from 'material-ui/IconButton'
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import Done from 'material-ui/svg-icons/action/done'

injectTapEventPlugin();

interface IStrategyRowProps {
    strategy: IStrategy;
}

interface IStrategyRowState {
    errorDialogOpened?: boolean;
}

export class StrategyRow extends React.Component<IStrategyRowProps, IStrategyRowState> {
    constructor(props: IStrategyRowProps) {
        super(props);
        this.state = {errorDialogOpened: false};
    }

    componentDidMount(){
    }
    
    handleOpenErrorDialog(){
        this.setState({errorDialogOpened: true});
    }

    handleCloseErrorDialog() {
        this.setState({errorDialogOpened: false});
    }
    
    // POST doesn't save type of date and JS think, that it's string!
    // TODO: Need to solve this later!
    formatDate(rawDate: any) {
        var d = new Date(rawDate);
        return d.getHours() + ":" + d.getMinutes() + " "
            + d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
    }
    
    render() {
        return (
             <TableRow>
                <TableRowColumn>
                    {this.formatDate(this.props.strategy.date)}
                </TableRowColumn>
                <TableRowColumn>{this.props.strategy.status === "error" ?
                    <div>
                        <ErrorOutline
                            onClick={() => this.handleOpenErrorDialog()}
                            style={{
                                cursor: 'pointer',
                                color: 'darkred'
                            }}
                        />
                        <Dialog
                            open={this.state.errorDialogOpened}
                            modal={false}
                            autoScrollBodyContent={true}
                            onRequestClose={() => this.handleCloseErrorDialog()}
                        >
                            <pre>
                                {this.props.strategy.errorMessage}
                            </pre>]
                        </Dialog>
                    </div>:
                    this.props.strategy.status == "compiling" ?
                        "" :
                        <Done
                            color='darkgreen'
                        />}
                </TableRowColumn>
                <TableRowColumn>
                    <a
                        href = {"data:text/plain;charset=utf-8," + 
                            encodeURIComponent(this.props.strategy.source) }
                        target = "_blank"
                        download = "MyStategy.java"
                    >
                        Download
                    </a>
                </TableRowColumn>
            </TableRow>
        );
    }
}
