import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Rooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        }
    }

    componentWillMount() {
        axios.create({
            baseURL: this.props.serverIp
        });
        axios.get("/getRooms")
            .then((res) => {
                this.setState({rooms: res});
            })
    }

    render() {
        return (
            this.state.rooms.map(item => {
                return (
                    <p>
                        {item.name}
                    </p>
                )
            })
        )
    }
}
const mapStateToProps = (state) => ({
    serverIp: state.serverIp
});

export default connect(
    mapStateToProps,
    null
)(Rooms)