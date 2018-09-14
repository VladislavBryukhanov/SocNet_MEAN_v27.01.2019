import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../Components/authorization';
import { Link, withRouter } from 'react-router-dom';

class NavBar extends Component {

    openProfile = (e) => {
        e.preventDefault();
        this.props.history.push(`/profile/${this.props.profile._id}`);
    }

    render () {
        return (
            <div className="navBar">
                <div className="navigation">
                    <div>
                        <Link to="/chat_list">Rooms</Link>
                        <Link to="/user_list">Users</Link>
                    </div>
                </div>
                <div className="profile">
                    <Link to="/edit_profile" className="username">{this.props.profile.username}</Link>
                    <img src={this.props.profile.avatar} className="userAvatar" onClick={this.openProfile}/>
                    <a onClick={signOut} className="logOutBtn">Log out</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    profile: state.profile,
    serverIp: state.serverIp
});

export default compose (
    connect (
        mapStateToProps
    ),
    withRouter
)(NavBar);