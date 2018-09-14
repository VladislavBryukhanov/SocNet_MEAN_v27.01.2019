import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            login: '',
            password: '',
            navatar: null
        }
    }

    componentWillMount() {
        this.setState({username: this.props.profile.username, login: this.props.profile.login});
    }

    onUsernameChanged = (e) => {
        this.setState({username: e.target.value});
    }

    onLoginChanged = (e) => {
        this.setState({login: e.target.value});
    }

    onPasswordChanged = (e) => {
        this.setState({password: e.target.value});
    }

    onAvatarChanged = (e) => {
        this.setState({avatar: e.target.files[0]});
    }

    onSaveChanges = (e) => {
        e.preventDefault();
        let user = new FormData();
        user.append('username', this.state.username);
        user.append('login', this.state.login);

        if(this.state.avatar)
            user.append('avatar', this.state.avatar);
        if(this.state.password)
        user.append('password', this.state.password);

        axios.post('/users/editProfile', user)
            .then((res) => {
                this.props.editProfile(res.data);
            })
    }

    render() {
        return (
            <form onSubmit = {this.onSaveChanges}>
                <input onChange={this.onAvatarChanged} type="file"/>
                <input onChange={this.onUsernameChanged} value={this.state.username} type="text" placeholder="username"/>
                <input onChange={this.onLoginChanged} value={this.state.login} type="text" placeholder="login"/>
                <input onChange={this.onPasswordChanged} type="password" placeholder="password"/>
                <input type="submit" value="save"/>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
   profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
   editProfile: (profile) => {
       dispatch({type: 'authorize', profile: profile})

   }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProfile);