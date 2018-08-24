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
            username: 'USER',
            onlineCounter: 0
        }
    }

    componentDidMount() {
        this.props.socket.on("newConnection", (users) => {
            this.setState({onlineCounter: users})
        });
        this.props.socket.on("messages", (messages) => {
            this.props.loadMessages(messages);
        });
        this.props.socket.on("message", (msg) => {
            this.props.addMessage(msg);
        });
    }

    onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    };

    render() {
        return (
            <div>
                <div>Online: {this.state.onlineCounter}</div>
                <input
                    value={this.state.username}
                    onChange={this.onUsernameChange}
                    placeholder="Nickname"/>
                <hr/>
                <div>
                    {this.props.messages.map((item) => {
                        return <p key={item._id}>
                            {item.username}: {item.content} | {item.time}
                        </p>
                    })}
                </div>
                <hr/>
                <InputComponent/>
            </div>

        );
    }
}

const mapStateToProps = (state) => ({
    socket: state.socket,
    messages: state.messages
});

const mapDispatchToProps = (dispatch) => ({
    loadMessages: (messages) => (
        dispatch({type: "loadMessages", messages: messages})
    ),
    addMessage: (message) => (
        dispatch({type: "addMessage", message: message})
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)
(App);
