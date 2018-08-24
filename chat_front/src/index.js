import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Rooms from './rooms';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider,  } from 'react-redux';
import io from 'socket.io-client';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// const socketIp = "192.168.0.103:31315";
// var socketIp = "192.168.1.220:31315";

const initState = {
    serverIp: "192.168.0.103:31315",
    socket: io("192.168.0.103:31315", {
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
                {/*<Route path="/" component={Rooms}/>*/}
                <Route path="/dialog" component={App}/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();


// redactions
// router
// socket rooms