import React, { Component } from 'react';
import axios from 'axios';

class BlogContructor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            files: []
        }
    }

    onSubmitPost = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('content', this.state.content);
        // MB get user from token ?
        // data.append('owner', this.state.content);
        data.append('files', files);
        axios.post('', data)
            .then((res) => {
                console.log(res.data);
            })
    }

    render() {
        return (
            <form onSubmit={this.onSubmitPost} className="blogConstructor">
                <textarea className="blogContent"/>
                <input type="file" multiple />
                <input type="submit"/>
            </form>
        )
    }
}

export default BlogContructor;