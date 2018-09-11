import React from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { store } from '../index';

const cookie = new Cookies();
export function signIn (data) {
    cookie.set('token', data.token, {path: '/', expiresIn: 365 * 24 * 60 * 60});
    axios.defaults.headers = {
        authorization: 'Bearer ' + data.token
    };
    store.dispatch({type: "authorize", profile: data.user});
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
