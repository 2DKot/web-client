/// <reference path="../typings/index.d.ts"/>
/// <reference path="./config.d.ts"/>
"use strict";

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import {Hello, Secret} from './test';
import {Login} from './login';
import {Signup} from './signup';
import {SendStrategy} from './send-strategy';
import {StrategiesList} from './strategies-list';
import {SessionsList} from './sessions-list'
import {Profile} from './profile'
import {styles} from './styles'
import {UsersList} from './users-list'
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import Person from 'material-ui/svg-icons/social/person'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import Storage from 'material-ui/svg-icons/device/storage'
import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play'
import People from 'material-ui/svg-icons/social/people'

// import {fetch} from 'fetch';

var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";

interface IAppProps {
    children;
}

interface IAppState {
    accessToken?: string
}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var token = localStorage.getItem("token");
        if (token) {
            fetch(endpoint + 'secret/', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ accessToken: token });
                    }
                    else if (res.status == 401) {
                        localStorage.removeItem("token");
                        return;
                    }
                    else {
                        console.log("Unexpected code: " + res.status);
                    }
                })
                .catch(ex => {
                    console.log('parsing failed', ex);
                });

        }
    }
    
    handleLogin(accessToken: string){
        this.setState({accessToken: accessToken});
        localStorage.setItem("token", accessToken);
    }
    
    logout(){
        this.setState({ accessToken: "" });
        localStorage.removeItem("token");
    }
    
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar showMenuIconButton={false} title='UI-Contester'/>
                    <List style={styles.menu}>
                        <Link to='/profile'>
                            <ListItem 
                                primaryText='My profile'
                                leftIcon={<Person/>}    
                            />
                        </Link>
                        <Link to='/strategies/new'>
                            <ListItem 
                                primaryText='Send strategy'
                                leftIcon={<FileUpload/>}    
                            />
                        </Link>
                        <Link to='/strategies'>
                            <ListItem 
                                primaryText='My strategies'
                                leftIcon={<Storage/>}    
                            />
                        </Link>
                        <Link to='/sessions'>
                            <ListItem 
                                primaryText='Sessions'
                                leftIcon={<PlaylistPlay/>}    
                            />
                        </Link>
                        <Link to='/users'>
                            <ListItem 
                                primaryText='Сompetitors'
                                leftIcon={<People/>}    
                            />
                        </Link>
                    </List>
                    <div style={styles.content}>
                        {this.props.children}
                    </div>
                </div>
            </MuiThemeProvider>       
        );
    }
}

ReactDom.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="signup" component={Signup}/>
      <Route path="profile" component={Profile}/>
      <Route path="strategies/new" component={SendStrategy}/>
      <Route path="strategies" component={StrategiesList}/>
      <Route path="sessions" component={SessionsList}/>
      <Route path="users" component={UsersList}/>
    </Route>
  </Router>
), document.getElementById('app'))