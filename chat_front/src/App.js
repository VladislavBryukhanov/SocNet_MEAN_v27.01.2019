import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withCookies } from 'react-cookie';
import NavBar from './Components/navBar';
import Auth from "./Pages/auth";
import Registration from "./Pages/registration";
import Rooms from './Pages/rooms';
import Chat from './Pages/chat';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios.defaults.baseURL = this.props.serverIp;
        if(!this.props.cookies.get('token')) {
            this.props.history.push("/");
        } else {
            axios.defaults.headers = {
                authorization: 'Bearer ' + this.props.cookies.get('token')
            };
            // this.props.history.push("/rooms");
        }
    }

    render() {
        return (
            <div>
                {/*<NavBar/>*/}
                <Switch>
                    <Route exact path="/" component={Auth}/>
                    <Route path="/registration" component={Registration}/>
                    <Route path="/rooms" component={Rooms}/>
                    <Route path="/chat/:roomId" component={Chat}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    socket: state.socket,
    serverIp: state.serverIp
});

export default compose (
    withCookies,
    connect(mapStateToProps)
)(App);
