import React, { Component } from 'react';
import { connect } from 'react-redux';

class InputComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: ''
        }
    }

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
    onSendMessage2 = () => {
        this.props.socket.emit("messageRoom", 'E');
        this.props.socket.on("cb", (msg) => {
            console.log(msg);
        });
    };
    onSendMessage3 = () => {
        this.props.socket.emit("join", 'q');
        this.props.socket.on("cb", (msg) => {
            console.log(msg);
        });
    };

    keyBind = (e) => {
        if(e.key === 'Enter') {
            this.onSendMessage();
        }
    };

    render() {
        return (
            <div>
                <input
                    value={this.state.messageContent}
                    onChange={this.onMessageChange}
                    onKeyPress={this.keyBind}
                    placeholder="message" />

                <button onClick={this.onSendMessage}>Send</button>
                <button onClick={this.onSendMessage2}>Send</button>
                <button onClick={this.onSendMessage3}>Send</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
   socket: state.socket
});

export default connect(
    mapStateToProps,
    null
)(InputComponent);