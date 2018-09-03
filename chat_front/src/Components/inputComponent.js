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
                content: this.state.messageContent,
                roomId: this.props.roomId
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
                <input
                    value={this.state.messageContent}
                    onChange={this.onMessageChange}
                    onKeyPress={this.keyBind}
                    placeholder="message" />

                <button onClick={this.onSendMessage}>Send</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
   socket: state.socket
});

export default connect(mapStateToProps)(InputComponent);