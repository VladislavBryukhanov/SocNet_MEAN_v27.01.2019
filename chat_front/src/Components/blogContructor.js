import React, { Component } from 'react';
import axios from 'axios';

class BlogContructor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            picture: null
        }
    }

    onContentChanged = (e) => {
        this.setState({content: e.target.value});
    }

    onPictureChanged = (e) => {
        this.setState({picture: e.target.files[0]});
    }

    onSubmitPost = (e) => {
        console.log(this.state.picture);
        console.log(this.state.content);
        e.preventDefault();
        let data = new FormData();
        data.append('content', this.state.content);
        // MB get user from token ?
        // data.append('owner', this.state.content);
        data.append('picture', this.state.picture);
        axios.post('/blogs/postBlog', data)
            .then((res) => {
                console.log(res.data);
            })
    }

    render() {
        return (
            <form onSubmit={this.onSubmitPost} className="blogConstructor">
                <textarea onChange={this.onContentChanged} className="blogContent"/>
                <input onChange={this.onPictureChanged} type="file" />
                <input type="submit"/>
            </form>
        )
    }
}

export default BlogContructor;