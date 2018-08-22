import React, { Component } from 'react';
// import io from 'socket.io-client';
import { connect } from 'react-redux';
import InputComponent from './inputComponent';

/*
const socket = io("192.168.1.220:31315", {
    path: "/chat"
});
*/

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            username: 'USER',
            onlineCounter: 0
        }
    }

    componentWillMount() {
        console.log(this.props.socket);
        console.log('+++++++++++++++++++++++++++');
        this.props.initSocket('/chat');
    }

    componentDidMount() {
        this.props.socket.on("newConnection", (users) => {
            this.setState({onlineCounter: users})
        });
        this.props.socket.on("messages", (messages) => {
            this.setState({messages: messages})
        });
        this.props.socket.on("message", (msg) => {
            this.setState({messages: [
                ...this.state.messages, msg
            ]});
        });
    }

  render() {
    return (
        <div>
            <div>Online: {this.state.onlineCounter}</div>
            <input onChange={this.onUsernameChange}
                   value={this.state.username}
                   placeholder="Nickname"/>
            <hr/>
            <div>
                {this.state.messages.map((item) => {
                    return <p key={item._id}>
                        {item.username}: {item.content} | {item.time}
                    </p>
                })}
            </div>
            <hr/>
            {/*<InputComponent/>*/}
        </div>

    );
  }
}

const mapStateToProps = (state) => ({
    socket: state.socket
});

const mapDispatchToProps = (dispatch) => ({
    initSocket: (path) => {
        dispatch({type: 'newSocket', path: path});
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)
(App);
