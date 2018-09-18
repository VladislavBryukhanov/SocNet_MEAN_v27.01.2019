import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class BlogContructor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetKey: '_',
            content: "",
            files: []
        }
    }

    onContentChanged = (e) => {
        this.setState({content: e.target.value});
    }

    onPictureChanged = (e) => {
        this.setState({files: [...(e.target.files)]});
    }

    onSubmitPost = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('content', this.state.content);
        // MB get user from token ?
        // data.append('owner', this.state.content);
        this.state.files.map((file) => {
            data.append('files', file);
        });
        axios.post('/blogs/addPost', data)
            .then((res) => {
                this.props.addPost(res.data);
                this.setState({content:'', resetKey: res.data._id});
            })
    }

    render() {
        return (
            <form onSubmit={this.onSubmitPost} className="blogConstructor">
                <textarea value={this.state.content} onChange={this.onContentChanged} className="blogContent"/>
                <input key={this.state.resetKey} onChange={this.onPictureChanged} type="file" multiple/>
                <input type="submit"/>
            </form>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    addPost: (blog) => {
        dispatch({type: 'addPost', blog: blog})
    }
});


export default connect(
    null, mapDispatchToProps
)(BlogContructor);