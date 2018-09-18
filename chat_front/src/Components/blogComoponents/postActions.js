import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class PostActions extends Component {
    constructor(props) {
        super(props);
    }

    deletePost = (e, id) => {
        e.preventDefault();
        axios.delete(`blogs/deletePost/${id}`)
            .then((res) => {
                this.props.deletePost(res.data._id);
            })
    }

    render() {
        return (
            <div className="blogActions">
                <div className="editBlog">
                    Edit
                </div>
                <div className="deleteBlog" onClick={e => this.deletePost(e, this.props.blog_id)}>
                    X
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    deletePost: (_id) => {
        dispatch({type: 'deletePost', _id: _id})
    }
});


export default connect(
    null, mapDispatchToProps
)(PostActions);