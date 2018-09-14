import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Users extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios.get('users/getUsers')
            .then((res) => {
                this.props.loadUsers(res.data);
            })
    }

    openProfile = (e, id) => {
        e.preventDefault();
        this.props.history.push(`/profile/${id}`);
    }

    render() {
        return (
            <div className="userList">
                {
                    this.props.users.map((user) => {
                        return (
                            <div key={user._id} className="user" onClick={(e) => {this.openProfile(e, user._id)}}>
                                <img src={user.avatar} className="userAvatar"/>
                                <span>{user.username}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.users
});

const mapDispatchToProps = (dispatch) => ({
    loadUsers: (users) => {
        dispatch({type: "loadUsers", users})
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);