import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
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
        this.state = {
            isAuthorized: false
        }
    }

    componentWillMount() {
        axios.defaults.baseURL = this.props.serverIp;
        if(!this.props.cookies.get('token')) {
            this.props.history.push("/");
        } else {
            axios.defaults.headers = {
                authorization: 'Bearer ' + this.props.cookies.get('token')
            };
            axios.post('/getProfile')
                .then(res => {
                    this.props.authorize(res.data);
                    this.setState({isAuthorized:true});
                });
            // this.props.history.push("/rooms");
        }
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" render={() => (
                    this.state.isAuthorized ?
                        <Redirect from='/' to='/chat_list'/>
                        :
                        <Auth/>
                )}/>
                <Route path="/registration" render={()=><Registration/>}/>
                <Route path="/chat_list" render={()=><NavBar/>}/>
            </Switch>
        );
    }
}

const mapStateToProps = (state) => ({
    socket: state.socket,
    serverIp: state.serverIp
});

const mapDispatchToProps = (dispatch) => ({
    authorize: (profile) => {
        dispatch({type: "authorize", profile: profile})
    }
});

export default compose (
    withCookies,
    connect(mapStateToProps, mapDispatchToProps)
)(App);
