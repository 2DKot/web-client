/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';

export interface IUsersListProps {
}

export interface IUsersListState {
}

export class UsersList extends React.Component<IUsersListProps, IUsersListState> {
    constructor(props: IUsersListProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                Competitors list
            </div>
        );
    }
}
