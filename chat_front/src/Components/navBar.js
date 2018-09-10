import React, { Component } from 'react';
import Rooms from '../Pages/rooms';
import Chat from '../Pages/chat';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../Components/authorization'

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>{this.props.profile.username}</p>
                <button onClick={signOut}>Log out</button>
                <hr/>
                <Switch>
                    <Route path="/chat_list" component={Rooms}/>
                    <Route path="/chat/:roomId" component={Chat}/>
                    <Redirect from='/' to='/chat_list'/>
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect (
    mapStateToProps
)(NavBar);