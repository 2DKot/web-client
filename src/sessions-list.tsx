/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';

export interface ISessionsListProps {
}

export interface ISessionsListState {
}

export class SessionsList extends React.Component<ISessionsListProps, ISessionsListState> {
    constructor(props: ISessionsListProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                Sessions list will be here..
            </div>
        );
    }
}
