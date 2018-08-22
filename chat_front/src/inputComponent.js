import React, { Component } from 'react';

class InputComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: ''
        }
    }

    onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    };

    onMessageChange = (e) => {
        this.setState({messageContent: e.target.value});
    };

    onSendMessage = () => {
        if(this.state.messageContent.trim().length > 0) {
            let message = {
                username: this.state.username,
                content: this.state.messageContent
            };
            this.props.socket.emit("message", message);
            this.setState({messageContent: ''});
        }
    };

    keyBind = (e) => {
        if(e.key === 'Enter') {
            this.onSendMessage();
        }
    };

    render() {
        return (
            <div>
                <input  onChange={this.onMessageChange}
                      onKeyPress={this.keyBind}
                      value={this.state.messageContent}
                      placeholder="message" />

                <button onClick={this.onSendMessage}>Send</button>
            </div>
        );
    }
}

export default InputComponent;