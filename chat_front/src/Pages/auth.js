import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { withCookies } from 'react-cookie';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password:''
        }
    }

/*    componentWillMount() {
        axios.defaults.baseURL = this.props.serverIp;
        axios.defaults.headers = {
            authorization: 'Bearer ' + this.props.cookies.get('token')
        };
    }*/

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
                this.props.cookies.set('token', res, {path: '/', expiresIn: 365 * 24 * 60 * 60});
                axios.defaults.headers = {
                    authorization: 'Bearer ' + res.data
                };
                this.props.history.push("/rooms");
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

const mapStateToProps = (state) => ({
    serverIp: state.serverIp
});

export default compose (
    withCookies,
    connect(mapStateToProps)
)(Auth);
