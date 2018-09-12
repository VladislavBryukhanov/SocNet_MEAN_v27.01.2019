import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withCookies } from 'react-cookie';
import NavBar from './Components/navBar';
import SignIn from "./Pages/signIn";
import Registration from "./Pages/registration";
import Rooms from './Pages/rooms';
import Chat from './Pages/chat';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios.defaults.baseURL = this.props.serverIp;
        // console.log(this.props.history);
        if(!this.props.cookies.get('token')) {
            this.props.history.push("/");
        } else {
            axios.defaults.headers = {
                authorization: 'Bearer ' + this.props.cookies.get('token')
            };
            axios.post('/autoSignIn')
                .then(res => {
                    this.props.authorize(res.data);
                    // this.props.history.push("/chat_list");
                });
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/" render={(props) => (
                        this.props.profile ?
                            <NavBar {...props} />
                            :
                            <Switch>
                                <Route exact path="/" component={SignIn}/>
                                <Route path="/registration" component={Registration}/>
                            </Switch>
                    )}/>
                </Switch>
            </div>

        );
    }
}

const mapStateToProps = (state) => ({
    socket: state.socket,
    serverIp: state.serverIp,
    profile: state.profile
});

const mapDispatchToProps = (dispatch) => ({
    authorize: (profile) => {
        dispatch({type: "authorize", profile: profile})
    },
    test: () => {
        return dispatch => {
            setTimeout(()=>{
                console.log('tetets');
                dispatch({type: "addMessage", message: "eeeeeee"});
            }, 3000)
        }
    }
});

export default compose (
    withCookies,
    connect(mapStateToProps, mapDispatchToProps)
)(App);
