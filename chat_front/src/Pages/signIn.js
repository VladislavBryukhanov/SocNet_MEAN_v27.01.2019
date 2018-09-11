import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { signIn } from '../Components/authorization';

class SignIn extends Component {
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
        let user = {
            login: this.state.login,
            password: this.state.password
        };
        axios.post('/signIn', user)
            .then((res) => {
                signIn(res.data);
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSignIn}>
                    <input onChange={this.onLoginChanged} name="login" placeholder="Login"/>
                    <input onChange={this.onPasswordChanged} name="password" type="password" placeholder="Password"/>
                    <input type="submit" value="Log in"/>
                    <Link to="/registration">Registration</Link>
                </form>
            </div>
        )
    }
}

export default SignIn;
