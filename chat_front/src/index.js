import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider,  } from 'react-redux';
import io from 'socket.io-client';
import {  BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import './styles/navBar.css';
import './styles/body.css';
import './styles/rooms.css';
import './styles/userList.css';
import './styles/chat.css';
import './styles/profile.css';

const ip = "http://192.168.1.200:31315";

const initState = {
    serverIp: ip,
    socket: io(ip, {
        path: "/chat"
    }),
    messages: [],
    users: [],
    profile: null
};

const Reducer = (state = initState, action) => {
    switch (action.type) {
        case "loadMessages": {
            return {
                ...state, messages: action.messages
            }
        }
        case "addMessage": {
            return {
                ...state, messages: [
                    ...state.messages, action.message
                ]
            }
        }
        case "authorize": {
            action.profile.avatar = `${ip}/${action.profile.avatar}`;
            return {
                ...state, profile: action.profile
            }
        }
        case "loadUsers": {
            action.users.map((user) => {
                return user.avatar = `${ip}/${user.avatar}`;
            });
            return {
                ...state, users: action.users
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
};

export const store = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
    <Provider store = {store}>
        <BrowserRouter>
            <Route component={App}/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();


// redactions
// router
// socket rooms