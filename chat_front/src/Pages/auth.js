import React, {Component} from 'react';
import { Link, Router, Route } from 'react-router-dom';
import Registration from "./registration";
import App from '../App';
import Rooms from './rooms';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password:''
        }
    }

    onLoginChanged = (e) => {
        this.setState({login: e.target.value});
    }

    onPasswordChanged = (e) => {
        this.setState({password: e.target.value});
    }

    onSignIn = (e) => {
        e.preventDefault();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onSignIn}>
                    <input onChange={this.onLoginChanged} name="login" placeholder="Login"/>
                    <input onChange={this.onPasswordChanged} name="password" type="password" placeholder="Password"/>
                    <input type="submit" value="Log in"/>
                    {/*<Link to="/Rooms">Rooms</Link>*/}
                    <Link to="/registration">Registration</Link>
                </form>
            </div>
        )
    }
}

export default Auth;

{/*
<Switch>
    <Route exact path="/" component={Rooms}/>
    <Route path="/dialog/:roomId" component={App}/>
</Switch>*/}
