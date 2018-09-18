import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PostActions from './postActions';

class Blogs extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios.get(`/blogs/getBlog/${this.props.match.params.userId}`)
            .then((res) => {
                this.props.loadBlogs(res.data);
            })
    }

    render() {
        return (
            <div className="blogs">
                {this.props.blogs.map((blog) => {
                    return (
                        <div key={blog._id} className="blogBody">
                            {
                                blog.attachedFiles[0] ?
                                    <img className="attachedImage" src={blog.attachedFiles[0]}/> : ''
                            }
                            <p className="textContent">{blog.textContent}</p>

                            {this.props.match.params.userId === this.props.profile._id ?
                                <PostActions blog_id={blog._id}/>: ''}
                        </div>
                    )
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
   blogs: state.blogs,
   profile: state.profile

});

const mapDispatchToProps = (dispatch) => ({
   loadBlogs: (blogs) => {
       dispatch({type: 'loadBlogs', blogs: blogs})
   }
});

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Blogs);