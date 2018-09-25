import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withCookies } from 'react-cookie';
import Application from './Components/application';
import SignIn from "./Pages/signIn";
import Registration from "./Pages/registration";

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
            axios.get('/autoSignIn')
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
                            <Application {...props} />
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
    }
});

export default compose (
    withCookies,
    connect(mapStateToProps, mapDispatchToProps)
)(App);
