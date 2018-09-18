import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

class Blogs extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios.get(`/blogs/getBlogs/${this.props.match.params.userId}`)
            .then((res) => {
                this.props.loadBlogs(res.data);
            })
    }

    render() {
        return (
            <div className="blogs">
                {this.props.blogs.map((blog) => {
                    return (
                        <div key={blog._id}>
                            {
                                blog.attachedFiles[0] ?
                                    <img className="attachedImage" src={blog.attachedFiles[0]}/> : ''
                            }
                            <p className="textContent">{blog.textContent}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
   blogs: state.blogs
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