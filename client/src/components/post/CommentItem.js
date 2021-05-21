import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';

import {deleteComment} from '../../actions/post';

const CommentItem = ({ 
    postId,
    comment: {_id, text, avatar, name, user, date},
    deleteComment,
    auth
}) => {
    return (
        <Fragment>
            <div className="post bg-white p-1 my-1">
                <div>
                    <Link to={`/profiles/${user}`}>
                        <img
                            className="round-img"
                            src={avatar}
                            alt=""
                        />
                        <h4>{name}</h4>
                    </Link>
                </div>
                <div>
                    <p className="my-1">
                        {text}
                    </p>
                    <p className="post-date">
                        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
                    </p>
                    {!auth.loading && user === auth.user._id && (
                        <button 
                            onClick={e => deleteComment(postId, _id)} 
                            type="button" 
                            className="btn btn-danger">
                                <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

CommentItem.propTypes = {
    deleteComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {deleteComment})(CommentItem);
