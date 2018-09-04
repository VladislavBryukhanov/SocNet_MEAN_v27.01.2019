import React from 'react';
import axios from 'axios';

function signIn (token, props) {
    props.cookies.set('token', token, {path: '/', expiresIn: 365 * 24 * 60 * 60});
    axios.defaults.headers = {
        authorization: 'Bearer ' + token
    };
    props.history.push("/rooms");
}

export default signIn;
