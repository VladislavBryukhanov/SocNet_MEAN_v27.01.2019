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
                this.setState(res.data);
        });
    }

    render() {
        return (
            <div>
                <img src={`${this.props.serverIp}/${this.state.avatar}`}/>
                <h2>{this.state.username}</h2>
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