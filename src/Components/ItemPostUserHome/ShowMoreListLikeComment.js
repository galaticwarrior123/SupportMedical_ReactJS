import './ShowMoreListLikeComment.css';
import CommentAPI from '../../API/CommentAPI';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



function ShowMoreListLikeComment({ commentId, handleCloseShowMoreListLikeComment }) {
    const [listLikeCommentInfo, setListLikeCommentInfo] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchListLikeCommentInfo = async () => {
            try {
                const response = await CommentAPI.getCommentById(commentId);
                setListLikeCommentInfo(response.data.likedBy);
            } catch (error) {
                console.log('Lỗi lấy dữ liệu comment');
            }
        }
        fetchListLikeCommentInfo();
    }, [commentId])
    return (
        <div className="show-more-list-like-comment-container" onClick={handleCloseShowMoreListLikeComment}>
            <div className="show-more-list-like-comment-header" onClick={(e) => e.stopPropagation()}>
                <span>Người thích bình luận</span>

                {listLikeCommentInfo.length > 0 ? (

                    <div className="show-more-list-like-comment-body">
                        {listLikeCommentInfo.map((likeCommentInfo) => (
                            <div className="show-more-list-like-comment-body-item" key={likeCommentInfo._id} onClick={() => navigate(`/forum/profile/${likeCommentInfo._id}`)}>
                                <img src={likeCommentInfo.avatar} alt="avatar" />
                                <span>{likeCommentInfo.firstName} {likeCommentInfo.lastName}</span>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="show-more-list-like-comment-body">
                        <span>Không có người nào thích bình luận này</span>
                    </div>
                )}
            </div>

        </div>
    )
}

export default ShowMoreListLikeComment;