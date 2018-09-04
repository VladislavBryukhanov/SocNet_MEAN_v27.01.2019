import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import signIn from '../Components/signIn';
import { connect } from 'react-redux';
import { compose } from 'redux';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password:''
        }
    }

    componentWillMount() {
        if(this.props.cookies.get('token')) {
            this.props.history.push("/rooms");
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
                signIn(res.data.token, this.props);
                this.props.authorize(res.data.user);
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

const mapDispatchToProps = (dispatch) => ({
    authorize: (profile) => {
        dispatch({type: "authorize", profile: profile})
    }
});

export default compose(
    withCookies,
    connect(null, mapDispatchToProps)
)(Auth);
