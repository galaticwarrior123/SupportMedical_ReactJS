import './ItemPostUserHome.css';
import PostDetail from '../../Pages/User/HomePage/CenterUserHome/PostDetail/PostDetail';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsUp, faComment, faPaperPlane, faArrowRight, faArrowLeft, faEarth, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, set } from 'date-fns';
import ShowPostDetailLike from './ShowPostDetailLike';
import { se, vi } from 'date-fns/locale';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PostAPI from '../../API/PostAPI';
import CommentAPI from '../../API/CommentAPI';
import ShowComment from './ShowComment';
import ShowMore from './ShowMore';

const ItemPostUserHome = ({ itemPost, currentUser, isPostDetail = false, onDelete }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [post, setPost] = useState({});
    const [liked, setLiked] = useState(false);
    const [clickComment, setClickComment] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showPostDetail, setShowPostDetail] = useState(false);
    const [numberOfLikes, setNumberOfLikes] = useState(itemPost?.likedBy?.length || 0);
    const [numberOfComments, setNumberOfComments] = useState(itemPost?.comments?.length || 0);
    const [showPostDetailLike, setShowPostDetailLike] = useState(false);
    const [likedByUsers, setLikedByUsers] = useState(itemPost.likedBy);
    const [listComment, setListComment] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const location = useLocation();
    const [showMore, setShowMore] = useState(false);


    const images = itemPost.images || [];

    useEffect(() => {
        setNumberOfLikes(itemPost.likedBy.length);
        setLikedByUsers(itemPost.likedBy);
        fetchListComment();
        fetchPost();
        setLiked(itemPost.likedBy.some(user => user._id === currentUser._id));

    }, [itemPost]);

    const fetchListComment = async () => {
        try {
            const response = await CommentAPI.getCommentByPostId(itemPost._id);
            setListComment(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await PostAPI.getPostById(itemPost._id);
            setPost(response.data[0]);
            setLiked(response.data[0].likedBy.some(user => user._id === currentUser._id));
            setNumberOfLikes(response.data[0].likedBy.length);
        } catch (error) {
            console.log(error);
        }
    };


    const handlePostComment = async (postId) => {
        const data = {
            postId: postId,
            content: commentContent,
            userId: user._id
        };
        try {
            const newComment = await CommentAPI.createComment(data);
            setCommentContent('');
            setNumberOfComments(numberOfComments + 1);
            // Update listComment directly with the new comment
            if (clickComment) {
                // Insert the new comment at the start of the list
                setListComment(prevList => [newComment.data, ...prevList]);
            } else {
                // Update listComment for the case when comments are not shown
                setListComment(prevList => [...prevList, newComment.data]);
            }
            toast.success('Bình luận thành công');
        } catch (error) {
            toast.error('Bình luận thất bại');
        }
    };


    const handleLike = async () => {
        try {
            if (liked) {
                await PostAPI.unlikePost(itemPost._id);
                setNumberOfLikes(numberOfLikes - 1);
                setLikedByUsers(likedByUsers.filter(user => user._id !== currentUser._id));
            } else {
                await PostAPI.likePost(itemPost._id);
                setNumberOfLikes(numberOfLikes + 1);
                setLikedByUsers([...likedByUsers, currentUser]);
            }

            setLiked(!liked);




        } catch (error) {
            console.log(error);
        }
    };



    const handleComment = () => {
        setClickComment(!clickComment);

        // nếu mà gủi bình luận ở chế độ show hết comment sau khi gửi phải hiện liền ngay bình luận mới nhất lên
        if (clickComment) {
            setListComment([...listComment].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
    };
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };
    const handlePrevImage = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const handleNextImage = () => {
        if (selectedImageIndex < images.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };
    const closeFullscreen = () => {
        setSelectedImageIndex(null);


    };
    const handleClickSeeDetail = () => {
        setShowPostDetail(true);
        fetchPost();

    };
    const handleCloseFullScreen = () => {
        setShowPostDetail(false);
        setShowPostDetailLike(false);
        fetchPost();
    }

    const handleSeeDetailLike = () => {
        setShowPostDetailLike(true);
    }

    const handleShowMore = () => {
        setShowMore(!showMore);
    }

    const formattedTime = (() => {
        // Kiểm tra xem itemPost.createdAt có phải là chuỗi ngày hợp lệ không
        const date = new Date(itemPost.createdAt);
        // Kiểm tra xem đối tượng Date có hợp lệ không
        if (isNaN(date.getTime())) {
            return 'Ngày không hợp lệ';
        }
        return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    })();

    const renderBadge = () => {
        if (itemPost.author.roles.includes('DOCTOR')) {
            return <span className="center-user-home-post-badge"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Bác sĩ</span>;
        } else if (itemPost.author.roles.includes('NURSE')) {
            return <span className="center-user-home-post-badge"><FontAwesomeIcon icon={faCheck} style={{ color: 'blue' }} /> Y tá</span>;
        } else if (itemPost.author.roles.includes('CLIENT')) {
            return <span className="center-user-home-post-badge"><FontAwesomeIcon icon={faCheck} style={{ color: 'gray' }} /> Khách hàng</span>;
        }
        return null; // No badge for other roles
    };

    return (
        <div className="center-user-home-post">

            <div className="center-user-home-post-header">
                <div className="center-user-home-post-avatar">
                    <img src="https://via.placeholder.com/50" alt="avatar" />
                </div>
                <div className="center-user-home-post-user-info">
                    <div className="center-user-home-post-user-info-top">
                        <div className="center-user-home-post-user-info-top-name">
                            <span>{itemPost.author.firstName} {itemPost.author.lastName}</span>
                            {renderBadge()}
                        </div>
                        <div>
                            {location.pathname === '/profile' && (
                                <>
                                    <div className="center-user-home-post-user-info-top-action">
                                        <button onClick={handleShowMore}><FontAwesomeIcon icon={faEllipsis} style={{ color: 'gray' }} /></button>

                                    </div>
                                    {showMore && <ShowMore itemPost={itemPost} onDelete={onDelete}/>}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="center-user-home-post-date">
                        <span>{formattedTime}</span>
                        {location.pathname === '/profile' && (
                            <span className="center-user-home-post-privacy"><FontAwesomeIcon icon={faEarth} style={{ color: 'gray' }} /> Công khai</span>
                        )}
                    </div>
                </div>

            </div>
            {showPostDetail && <PostDetail handleCloseFullScreen={handleCloseFullScreen} itemPost={post} />}
            <div className="center-user-home-post-title">
                {isPostDetail ? (
                    <>
                        {itemPost.content}
                    </>

                ) : (
                    <>
                        {itemPost.title}
                        <span onClick={() => handleClickSeeDetail()}>Xem chi tiết...</span>
                    </>
                )}
            </div>
            <div className="center-user-home-post-categories">
                <span className="center-user-home-post-category cate1">Cate 1</span>
                <span className="center-user-home-post-category cate2">Cate 2</span>
            </div>
            <div className="center-user-home-post-images">
                {images.length > 0 && (
                    <div className="center-user-home-post-images">
                        {images.length === 1 && (
                            <div className="center-user-home-post-image full-width" onClick={() => handleImageClick(0)}>
                                <img src={images[0]} alt="post-img-1" />
                            </div>
                        )}
                        {images.length === 2 && images.map((image, index) => (
                            <div key={index} className="center-user-home-post-image half-width" onClick={() => handleImageClick(index)}>
                                <img src={image} alt={`post-img-${index + 1}`} />
                            </div>
                        ))}
                        {images.length === 3 && (
                            <>
                                <div className="center-user-home-post-image half-width" onClick={() => handleImageClick(0)}>
                                    <img src={images[0]} alt="post-img-1" />
                                </div>
                                <div className="center-user-home-post-image half-width" onClick={() => handleImageClick(1)}>
                                    <img src={images[1]} alt="post-img-2" />
                                </div>
                                <div className="center-user-home-post-image full-width" onClick={() => handleImageClick(2)}>
                                    <img src={images[2]} alt="post-img-3" />
                                </div>
                            </>
                        )}
                        {images.length === 4 && images.map((image, index) => (
                            <div key={index} className="center-user-home-post-image quarter-width" onClick={() => handleImageClick(index)}>
                                <img src={image} alt={`post-img-${index + 1}`} />
                            </div>
                        ))}
                        {images.length >= 5 && (
                            <>
                                <div className="center-user-home-post-image half-width" onClick={() => handleImageClick(0)}>
                                    <img src={images[0]} alt="post-img-1" />
                                </div>
                                <div className="center-user-home-post-image half-width" onClick={() => handleImageClick(1)}>
                                    <img src={images[1]} alt="post-img-2" />
                                </div>
                                <div className="center-user-home-post-image third-width" onClick={() => handleImageClick(2)}>
                                    <img src={images[2]} alt="post-img-3" />
                                </div>
                                <div className="center-user-home-post-image third-width" onClick={() => handleImageClick(3)}>
                                    <img src={images[3]} alt="post-img-4" />
                                </div>
                                <div className="center-user-home-post-image third-width center-user-home-post-image-more" onClick={() => handleImageClick(4)}>
                                    <img src={images[4]} alt="post-img-more" />
                                    <div className="center-user-home-post-image-overlay">
                                        <span>+{images.length - 5}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            {selectedImageIndex !== null && (
                <div className="fullscreen-overlay" onClick={closeFullscreen}>
                    <div className="button-transfer-image">
                        <button className="prev-button" onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>

                        <img src={images[selectedImageIndex]} alt="fullscreen-img" className="fullscreen-image" />

                        <button className="next-button" onClick={(e) => { e.stopPropagation(); handleNextImage(); }}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            )}
            <div className="center-user-home-post-footer">
                <div className="center-user-home-post-footer-infoPost">
                    <div className='center-user-home-post-footer-infoPost-like' onClick={handleSeeDetailLike}>
                        <span><FontAwesomeIcon icon={faThumbsUp} style={{ color: '#41C9E2', marginRight: '2' }} />
                            {numberOfLikes} lượt thích
                        </span>
                    </div>
                    {showPostDetailLike && <ShowPostDetailLike handleCloseFullScreen={handleCloseFullScreen} listUserLiked={likedByUsers} />}
                    <span><FontAwesomeIcon icon={faComment} style={{ color: '#41C9E2', marginRight: '2' }} />
                        {numberOfComments} bình luận</span>
                </div>
                <div className="center-user-home-post-footer-action">
                    <table>
                        <tr>
                            <td>
                                <button onClick={handleLike}>
                                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: liked ? 'blue' : 'black', marginRight: '2' }} />
                                    <span style={{ color: liked ? 'blue' : 'black' }}>Thích</span>
                                </button>
                            </td>
                            <td><button onClick={handleComment}>
                                <FontAwesomeIcon icon={faComment} style={{ color: 'black', marginRight: '2' }} />
                                Xem bình luận</button></td>
                        </tr>
                    </table>

                </div>
                <div className="center-user-home-post-footer-comment">
                    <div className="center-user-home-post-comment-avatar">
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                    </div>
                    <div className="center-user-home-post-comment-input">
                        <input type="text" placeholder="Viết bình luận..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                        <button onClick={() => handlePostComment(itemPost._id)}>
                            <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'silver' }} />
                        </button>

                    </div>
                </div>

                {clickComment && (
                    <>
                        <div className="center-user-home-post-comment-title">
                            <span>Danh sách bình luận</span>
                        </div>
                        <div className="center-user-home-post-comment-list">
                            {listComment.length > 0 ? (
                                <ShowComment listComment={listComment} />
                            ) : (
                                <div className="center-user-home-post-comment-list-item">
                                    <span>Không có bình luận nào</span>
                                </div>
                            )}

                        </div>
                    </>

                )}
            </div>
        </div>
    )
}

export default ItemPostUserHome;