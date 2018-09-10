import React from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookie = new Cookies();
export function signIn (token) {
    cookie.set('token', token, {path: '/', expiresIn: 365 * 24 * 60 * 60});
    axios.defaults.headers = {
        authorization: 'Bearer ' + token
    };
    // props.history.push("/chat_list");
}

export function signOut () {
    cookie.remove('token');
    axios.defaults.headers = {
        authorization: ''
    };
    // props.history.push("/");
    window.location.href = "/";
}
