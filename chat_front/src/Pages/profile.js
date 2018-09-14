import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        // console.log(this.props.match.params.userId);
        axios.get(`users/getUser/${this.props.match.params.userId}`)
            .then((res) => {
                res.data.avatar = `${this.props.serverIp}/${res.data.avatar}`;
                this.setState(res.data);
        });
    }

    render() {
        return (
            <div className="profile">
                <img src={this.state.avatar} className="avatar"/>
                <h1 className="username">{this.state.username}</h1>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
   serverIp: state.serverIp
});

export default connect(
    mapStateToProps
)(Profile);