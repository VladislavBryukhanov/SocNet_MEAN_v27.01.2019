import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import BlogContructor from "../Components/blogContructor";
import Blogs from "../Components/blogs";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
            <div>
                <div className="profile">
                    <img src={this.state.avatar} className="avatar"/>
                    <h1 className="username">{this.state.username}</h1>
                </div>
                <Blogs/>
                {this.props.match.params.userId === this.props.profile._id ? <BlogContructor/> : ''}
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
   serverIp: state.serverIp,
   profile: state.profile
});

export default connect(
    mapStateToProps
)(Profile);