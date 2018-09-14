import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Rooms from '../Pages/rooms';
import Users from '../Pages/users';
import Chat from '../Pages/chat';
import Profile from '../Pages/profile';
import EditProfile from '../Pages/editProfile';
import NavBar from './navbar';
import SideMenu from "./sideMenu";

class Application extends Component {
    constructor(props) {
        super(props);
    }

render() {
        return (
            <div>
                <NavBar/>
                <SideMenu/>
                <div className="body">
                    <Switch>
                        <Route path="/chat_list" component={Rooms}/>
                        <Route path="/user_list" component={Users}/>
                        <Route path="/profile/:userId" component={Profile}/>
                        <Route path="/edit_profile" component={EditProfile}/>
                        <Route path="/chat/:roomId" component={Chat}/>
                        <Redirect from='/' to='/chat_list'/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Application;