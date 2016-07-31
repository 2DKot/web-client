/// <reference path="../typings/index.d.ts"/>

"use strict";
import * as React from 'react';

export interface ILoaderProps {
    show: boolean;
}

export interface ILoaderState {
}

export default class Loader extends React.Component<ILoaderProps, ILoaderState> {
    constructor(props: ILoaderProps) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            this.props.show ?
                <div className="loader">
                    <svg className="circular" viewBox="25 25 50 50">
                        <circle 
                            className="path" 
                            cx="50" 
                            cy="50" 
                            r="20" 
                            fill="none" 
                            strokeWidth="2" 
                            strokeMiterlimit="10"/>
                    </svg>
                </div>
            :null
        );
    }
}
