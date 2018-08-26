import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
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
        let user = {
            login: this.state.login,
            password: this.state.password
        };
        axios.defaults.baseURL = this.props.serverIp;
/*        axios.create({
            baseURL: 'https://some-domain.com/api/',
            timeout: 1000,
            headers: {'X-Custom-Header': 'foobar'}
        });*/
        axios.post('/signIn', user)
            .then((res) => {
                console.log(res.data);
                axios.defaults.headers = {
                    token: res.data
                };
            });
    };

    test = () => {
        axios.get('/test')
            .then((res) => {
                console.log(res.data);
            });
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
                <div onClick={this.test}>TEST</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    serverIp: state.serverIp
});

export default connect(
    mapStateToProps,
    null
)(Auth);

{/*
<Switch>
    <Route exact path="/" component={Rooms}/>
    <Route path="/dialog/:roomId" component={App}/>
</Switch>*/}
