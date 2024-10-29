import './ShowComment.css';
import { formatDistanceToNow, set } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faThumbsUp, faImage, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import CommentAPI from '../../API/CommentAPI';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const ShowComment = ({ listComment }) => {
    const [showReplyInputOfMainComment, setShowReplyInputOfMainComment] = useState(null);
    const [expandedReplies, setExpandedReplies] = useState([]);
    const [commentValue, setCommentValue] = useState('');
    const [commentReplyValue, setCommentReplyValue] = useState('');
    const [replyCount, setReplyCount] = useState({});
    const [commentLikeCount, setCommentLikeCount] = useState({});
    const [allComment, setAllComment] = useState([...listComment]);

    const [selectedImages, setSelectedImages] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const replyCount = {};
        allComment.forEach((comment) => {
            replyCount[comment._id] = comment.replies.length;
        });
        setReplyCount(replyCount);
        setCommentLikeCount(allComment.reduce((acc, comment) => {
            acc[comment._id] = comment.likedBy.length;
            return acc;
        }, {}));
    }, [allComment]);

    const handleImageUpload = (e, commentId) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImages(prev => ({
                ...prev,
                [commentId]: file // Lưu ảnh cho commentId
            }));
        }
    };
    const handleDeleteImage = (commentId) => {
        setSelectedImages(prev => ({
            ...prev,
            [commentId]: null // Xóa ảnh cho commentId tương ứng
        }));

    };

    const handleShowReplyMainComment = (id) => {
        setShowReplyInputOfMainComment(prev => prev === id ? null : id);
    }

    const handlePostCommentReply = async (idParent, postId, isReply = false) => {
        const value = isReply ? commentReplyValue : commentValue;

        if (!value) return;

        const data = new FormData();
        data.append('postId', postId);
        data.append('content', value);
        data.append('parentCommentId', idParent);
        data.append('userId', user._id);
        if (selectedImages[idParent]) {
            data.append('imageContent', selectedImages[idParent]);
        }


        try {
            const newComment = await CommentAPI.createComment(data);
            isReply ? setCommentReplyValue('') : setCommentValue('');

            setSelectedImages(prev => ({
                ...prev,
                [idParent]: null
            }));

            const updateComments = (comments) => {
                return comments.map((comment) => {
                    if (comment._id === idParent) {
                        return {
                            ...comment,
                            replies: [...comment.replies, newComment.data]
                        }
                    } else if (comment.replies) {
                        return {
                            ...comment,
                            replies: updateComments(comment.replies)

                        }
                    }
                    return comment;
                });
            };

            setAllComment(updateComments(allComment));


            toast.success('Bình luận thành công');

        } catch (error) {
            toast.error('Bình luận thất bại');
        }
    }

    const handleLikeComment = async (commentId) => {
        try {
            const response = await CommentAPI.likeComment(commentId);
            const updatedComment = response.data;

            const updateComments = (comments) => {
                return comments.map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            likedBy: updatedComment.likedBy
                        }
                    } else if (comment.replies) {
                        return {
                            ...comment,
                            replies: updateComments(comment.replies)
                        }
                    }
                    return comment;
                });
            };

            setAllComment(updateComments(allComment));
        } catch (error) {
            toast.error('Thích bình luận thất bại');
        }
    }

    const toggleReplies = (commentId) => {
        if (expandedReplies.includes(commentId)) {
            setExpandedReplies(expandedReplies.filter((id) => id !== commentId));
        } else {
            setExpandedReplies([...expandedReplies, commentId]);
        }
    };
    const isLikedByUser = (likes) => {
        return likes.some(like => like === user._id);
    }
    const renderChildComment = (listChildComment, idParent) => {
        const totalReply = replyCount[idParent] || 0;
        const isExpand = expandedReplies.includes(idParent);
        const visibleReplies = isExpand ? listChildComment : listChildComment.slice(0, totalReply);
        const renderReplyRecursive = (reply) => {
            return (
                <>
                    <div className="center-user-home-post-comment-list-item-child-item" key={reply._id}>
                        <div className="center-user-home-post-comment-list-item-child-item-avatar">
                            <img src={reply.author.avatar} alt="avatar" />
                        </div>
                        <div className="center-user-home-post-comment-list-item-child-item-content">
                            <div className="center-user-home-post-comment-list-item-content-user">
                                <span>{reply.author?.firstName} {reply.author?.lastName}</span>
                                <span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: vi })}</span>
                            </div>
                            <div className="center-user-home-post-comment-item-content-text">
                                <pr>
                                    {reply.content}
                                </pr>
                            </div>
                            {reply.image && <div className="center-user-home-post-comment-item-content-image">
                                <img src={reply.image} alt="comment" />
                            </div>}
                            <div className="center-user-home-post-comment-item-content-action">
                                <div className="center-user-home-post-comment-item-content-action-interact">
                                    <button
                                        className={isLikedByUser(reply.likedBy) ? 'liked' : ''}
                                        onClick={() => handleLikeComment(reply._id)}
                                    >
                                        Thích
                                    </button>
                                    <button onClick={() => handleShowReplyMainComment(reply._id)}>Trả lời</button>
                                </div>

                                <div className="center-user-home-post-comment-item-content-action-reply-count">
                                    <span >
                                        {commentLikeCount[reply._id] || 0}
                                    </span>
                                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'blue' }} />
                                </div>

                            </div>

                            <div className={`center-user-home-post-comment-item-content-action-reply ${showReplyInputOfMainComment === reply._id ? 'show' : ''}`}>
                                <div className="center-user-home-post-comment-item-content-action-reply-avatar">
                                    <img src={user.avatar} alt="avatar" />
                                </div>
                                <div className="center-user-home-post-comment-item-content-action-reply-input">
                                    <input type="text" placeholder="Viết bình luận..." value={commentReplyValue} onChange={(e) => setCommentReplyValue(e.target.value)} />
                                    <div className="comment-icons">

                                        <label htmlFor={`image-upload-reply-${reply._id}`} className="image-upload-label">

                                            <FontAwesomeIcon icon={faImage} style={{ color: 'silver', cursor: 'pointer' }} />

                                        </label>

                                        <input
                                            id={`image-upload-reply-${reply._id}`}
                                            type="file"
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, reply._id)}
                                        />
                                        <button onClick={() => handlePostCommentReply(reply._id, reply.postId, true)}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'silver' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {selectedImages[reply._id] && (
                                <div className="image-preview">
                                    <div className="image-preview-title">
                                        <img src={URL.createObjectURL(selectedImages[reply._id])} alt="preview" />
                                        <button className="delete-image-btn" onClick={() => handleDeleteImage(reply._id)}>
                                            <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', cursor: 'pointer' }} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* <div className="center-user-home-post-comment-item-action-seeMore">
                            <button>Xem thêm</button>
                        </div> */}
                        </div>

                    </div>

                    <div className="center-user-home-post-comment-list-item-child">
                        {
                            reply.replies && renderChildComment(reply.replies, reply._id)
                        }
                    </div>
                </>
            )
        }
        return (
            <>
                {
                    <div className={`center-user-home-post-comment-list-item-child ${isExpand ? 'expand' : ''}`}>
                        {visibleReplies.map((reply) => renderReplyRecursive(reply))}
                    </div>
                }
                {
                    totalReply < listChildComment.length && (
                        <div className="center-user-home-post-comment-item-action-seeMore">
                            <button onClick={() => toggleReplies(idParent)}>{isExpand ? 'Ẩn bớt' : 'Xem thêm'}</button>
                        </div>
                    )
                }
            </>
        )
    }

    return (
        <div>

            {allComment.map((comment, index) => (

                <>
                    <div className="center-user-home-post-comment-list-item" key={comment._id}>

                        <div className="center-user-home-post-comment-list-item-avatar">
                            <img src={comment.author.avatar} alt="avatar" />
                        </div>
                        <div className="center-user-home-post-comment-list-item-content">
                            <div className="center-user-home-post-comment-list-item-content-user">
                                <span>{comment.author.firstName} {comment.author.lastName}</span>
                                <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}</span>
                            </div>
                            <div className="center-user-home-post-comment-item-content-text">
                                <pr>
                                    {comment.content}
                                </pr>
                            </div>
                            {comment.image && <div className="center-user-home-post-comment-item-content-image">
                                <img src={comment.image} alt="comment" />
                            </div>}
                            <div className="center-user-home-post-comment-item-content-action">
                                <div className="center-user-home-post-comment-item-content-action-interact">
                                    <button
                                        className={isLikedByUser(comment.likedBy) ? 'liked' : ''}
                                        onClick={() => handleLikeComment(comment._id)}>Thích</button>
                                    <button onClick={() => handleShowReplyMainComment(comment._id)}>Trả lời</button>
                                </div>

                                <div className="center-user-home-post-comment-item-content-action-reply-count">
                                    <span >
                                        {commentLikeCount[comment._id] || 0}
                                    </span>
                                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'blue' }} />
                                </div>
                            </div>


                            <div className={`center-user-home-post-comment-item-content-action-reply ${showReplyInputOfMainComment === comment._id ? 'show' : ''}`}>
                                <div className="center-user-home-post-comment-item-content-action-reply-avatar">
                                    <img src={user.avatar} alt="avatar" />
                                </div>
                                <div className="center-user-home-post-comment-item-content-action-reply-input">
                                    <input
                                        type="text"
                                        placeholder="Viết bình luận..."
                                        value={commentValue}
                                        onChange={(e) => setCommentValue(e.target.value)}
                                    />
                                    <div className="comment-icons">
                                        <label htmlFor={`image-upload-reply-${comment._id}`} className="image-upload-label">
                                            <FontAwesomeIcon icon={faImage} style={{ color: 'silver', cursor: 'pointer', marginLeft: '8px' }} />
                                        </label>
                                        <input
                                            id={`image-upload-reply-${comment._id}`}
                                            type="file"
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, comment._id)}
                                        />
                                        <button onClick={() => handlePostCommentReply(comment._id, comment.postId, false)}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'silver' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {selectedImages[comment._id] && (
                                <div className="image-preview">
                                    <div className="image-preview-title">
                                        <img src={URL.createObjectURL(selectedImages[comment._id])} alt="preview" />
                                        <button className="delete-image-btn" onClick={() => handleDeleteImage(comment._id)}>
                                            <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', cursor: 'pointer' }} />
                                        </button>
                                    </div>
                                </div>
                            )}


                        </div>

                    </div>

                    <div className="center-user-home-post-comment-list-item-child">
                        {
                            comment.replies && renderChildComment(comment.replies, comment._id)


                        }
                    </div>
                </>
            ))}
        </div>

    )
}

export default ShowComment;
