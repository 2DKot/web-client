/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';

export interface IProfileProps {
}

export interface IProfileState {
}

export class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                Profile, avatar...
            </div>
        );
    }
}
