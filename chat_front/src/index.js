import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider,  } from 'react-redux';
import io from 'socket.io-client';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import Auth from "./Pages/auth";
import Registration from "./Pages/registration";
import Rooms from './Pages/rooms';
// const socketIp = "192.168.0.103:31315";
// var socketIp = "192.168.1.220:31315";

const initState = {
    serverIp: "http://192.168.0.103:31315",
    socket: io("http://192.168.0.103:31315", {
        path: "/chat"
    }),
    messages: []
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
        default: {
            return {
                ...state
            }
        }
    }
};

const store = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
    <Provider store = {store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Auth}/>
                <Route path="/registration" component={Registration}/>
                <Route path="/Rooms" component={Rooms}/>
                <Route path="/dialog/:roomId" component={App}/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();


// redactions
// router
// socket rooms