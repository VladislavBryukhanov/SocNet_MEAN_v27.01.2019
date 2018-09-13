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
            avatar: null
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

    onAvatarChanged = (e) => {
        this.setState({avatar: e.target.files[0]});
    }

    onSaveChanges = (e) => {
        e.preventDefault();
        let user = new FormData();
        user.append('username', this.state.username);
        user.append('login', this.state.login);
        user.append('avatar', this.state.avatar);
        user.append('password', this.state.password);
        // let user = {
        //     username: this.state.username,
        //     login: this.state.login,
        //     avatar: this.state.avatar,
        //     password: this.state.password
        // };
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
                <input type="password" placeholder="password"/>
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