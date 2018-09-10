import React, { Component } from 'react';
import Registration from "../Pages/registration";
import Rooms from '../Pages/rooms';
import Chat from '../Pages/chat';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../Components/authorization'

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    signOut = () => {
        signOut(this.props);
    }

    render() {
        console.log('1');
        return (
            <div>
                <p>{this.props.profile.username}</p>
                <button onClick={this.signOut}>Log out</button>
                <hr/>
                <Switch>
                    <Route path="/chat_list" component={Rooms}/>
                    {/*<Route path="/chat_list" render={()=><NavBar/>}/>*/}
                    <Route path="/chat/:roomId" component={Chat}/>
                </Switch>
                {/*<Redirect from='/' to='/chat_list'/>*/}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect (
    mapStateToProps
)(NavBar);