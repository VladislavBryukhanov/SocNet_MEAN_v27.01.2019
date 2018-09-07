import React, { Component } from 'react';
import Registration from "../Pages/registration";
import Rooms from '../Pages/rooms';
import Chat from '../Pages/chat';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'USER',
        }
    }

    onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    };

    render() {
        return (
            <div>
                <input
                    value={this.state.username}
                    onChange={this.onUsernameChange}
                    placeholder="Nickname"/>
                <hr/>
                <Switch>
                    <Route path="/chat_list" render={()=><Rooms/>}/>
                    <Route path="/chat/:roomId" render={()=><Chat/>}/>
                </Switch>
            </div>
        )
    }
}

export default NavBar;