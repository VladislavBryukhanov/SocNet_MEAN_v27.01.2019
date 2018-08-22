import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import registerServiceWorker from './registerServiceWorker';
import io from 'socket.io-client';

var socketIp = "192.168.1.220:31315";

var initialState = {
    socket: {}
};

var Ruducers = (state = initialState, action) => {
    switch(action.type) {
        case 'newSocket': {
            return {
                ...state,
                socket: io(socketIp, {
                    path: action.path
                })
            }
        }
    }
};

var store = createStore(Ruducers, initialState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
