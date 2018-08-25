import React, { Component } from 'react';


class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'USER',
        }
    }

    onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    };

    render() {
        return (
            <div>
                <input
                    value={this.state.username}
                    onChange={this.onUsernameChange}
                    placeholder="Nickname"/>
                <hr/>
            </div>
        )
    }
}

export default NavBar;