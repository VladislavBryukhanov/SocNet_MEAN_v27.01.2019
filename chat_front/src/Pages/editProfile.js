import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            login: '',
        }
    }

    componentWillMount() {
        this.setState(this.props.profile);
    }

    onUsernameChanged = (e) => {
        this.setState({username: e.target.value});
    }

    onLoginChanged = (e) => {
        this.setState({login: e.target.value});
    }

    onSaveChanges = (e) => {
        e.preventDefault();
        let user = {
            username: this.state.username,
            login: this.state.login,
            password: this.state.password
        };
        axios.post('/users/editProfile', user)
            .then((res) => {
            console.log(res.data);
            })
    }

    render() {
        return (
            <form onSubmit = {this.onSaveChanges}>
                <input onChange={this.onUsernameChanged} value={this.state.username} type="text" placeholder="username"/>
                <input onChange={this.onLoginChanged} value={this.state.login} type="text" placeholder="login"/>
                <input type="password" placeholder="password"/>
                <input type="submit" value="save"/>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
   profile: state.profile,
});

export default connect(
    mapStateToProps
)(EditProfile);