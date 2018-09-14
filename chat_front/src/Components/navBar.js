import React, { Component } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Rooms from '../Pages/rooms';
import Users from '../Pages/users';
import Chat from '../Pages/chat';
import Profile from '../Pages/profile';
import { signOut } from '../Components/authorization';
import EditProfile from '../Pages/editProfile';

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    openProfile = (e) => {
        e.preventDefault();
        this.props.history.push(`/profile/${this.props.profile._id}`);
    }

render() {
        return (
            <div>
                <div className="navBar">
                    <div className="navigation">
                        <div>
                            <Link to="/chat_list">Rooms</Link>
                            <Link to="/user_list">Users</Link>
                        </div>
                    </div>
                    <div className="profile">
                        <Link to="/edit_profile" className="username">{this.props.profile.username}</Link>
                        <img src={this.props.profile.avatar} className="userAvatar" onClick={this.openProfile}/>
                        <a onClick={signOut} className="logOutBtn">Log out</a>
                    </div>
                </div>
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

const mapStateToProps = (state) => ({
    profile: state.profile,
    serverIp: state.serverIp
});

export default connect (
    mapStateToProps
)(NavBar);