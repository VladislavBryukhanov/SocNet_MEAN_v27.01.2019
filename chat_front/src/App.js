import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io("192.168.1.220:3000", {
    path: "/chat"
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            username: 'USER',
            messageContent: '',
            onlineCounter: 0
        }
    }

    keyBind = (e) => {
        if(e.key === 'Enter') {
            this.onSendMessage();
        }
    };

    onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    };

    onMessageChange = (e) => {
        this.setState({messageContent: e.target.value});
    };

    onSendMessage = () => {
        let message = {
            username: this.state.username,
            content: this.state.messageContent
        };
        socket.emit("message", message);
        this.setState({
            messages: [
                ...this.state.messages, message
            ],
            messageContent: ''
        });
    };

    componentDidMount() {
        socket.on("newConnection", (users) => {
            this.setState({onlineCounter: users})
        });
        socket.on("messages", (messages) => {
            this.setState({messages: messages})
        });
        socket.on("message", (msg) => {
            this.setState({messages: [
                ...this.state.messages, msg
            ]});
            console.log(msg);
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
            <input  onChange={this.onMessageChange}
                    onKeyPress={this.keyBind}
                    value={this.state.messageContent}
                    placeholder="message" />

            <button onClick={this.onSendMessage}>Send</button>
        </div>

    );
  }
}

export default App;
