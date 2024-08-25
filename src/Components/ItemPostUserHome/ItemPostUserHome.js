import './ItemPostUserHome.css';
import PostDetail from '../../Pages/User/HomePage/CenterUserHome/PostDetail/PostDetail';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsUp, faComment, faPaperPlane, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, set } from 'date-fns';
import ShowPostDetailLike from './ShowPostDetailLike';
import { vi } from 'date-fns/locale';

import PostAPI from '../../API/PostAPI';
const ItemPostUserHome = ({ itemPost, currentUser }) => {
    const [liked, setLiked] = useState(false);
    const [clickComment, setClickComment] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showPostDetail, setShowPostDetail] = useState(false);
    const [numberOfLikes, setNumberOfLikes] = useState(itemPost.likedBy.length);
    const [showPostDetailLike, setShowPostDetailLike] = useState(false);
    const [likedByUsers, setLikedByUsers] = useState(itemPost.likedBy);

    const images = itemPost.images || [];

    useEffect(() => {
        setLiked(itemPost.likedBy.some(user => user._id === currentUser._id));
        setNumberOfLikes(itemPost.likedBy.length);
        setLikedByUsers(itemPost.likedBy);
    }, [itemPost.likedBy, currentUser]);

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
    };
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };
    const handlePrevImage = () => {
        if (selectedImageIndex > 0) {
            console.log("prev" + selectedImageIndex);
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
    };
    const handleCloseFullScreen = () => {
        setShowPostDetail(false);
        setShowPostDetailLike(false);
    }

    const handleSeeDetailLike = () => {
        setShowPostDetailLike(true);
    }

    const formattedTime = formatDistanceToNow(new Date(itemPost.createdAt), { addSuffix: true, locale: vi });

    return (
        <div className="center-user-home-post">
            <div className="center-user-home-post-header">
                <div className="center-user-home-post-avatar">
                    <img src="https://via.placeholder.com/50" alt="avatar" />
                </div>
                <div className="center-user-home-post-user-info">
                    <div className="center-user-home-post-user-info-top">
                        <span>{itemPost.author.firstName} {itemPost.author.lastName}</span>
                        <span className="center-user-home-post-badge">
                            <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Bác sĩ</span>
                    </div>
                    <div className="center-user-home-post-date">
                        <span>{formattedTime}</span>
                    </div>
                </div>

            </div>
            {showPostDetail && <PostDetail handleCloseFullScreen={handleCloseFullScreen} itemPost={itemPost} />}
            <div className="center-user-home-post-title">{itemPost.title}
                <span onClick={handleClickSeeDetail}>Xem chi tiết...</span>
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
                        <span><FontAwesomeIcon icon={faThumbsUp} style={{ color: '#41C9E2', marginRight: '2' }}  />
                            {numberOfLikes} lượt thích
                        </span>
                    </div>
                    {showPostDetailLike && <ShowPostDetailLike handleCloseFullScreen={handleCloseFullScreen} listUserLiked={likedByUsers} />}
                    <span><FontAwesomeIcon icon={faComment} style={{ color: '#41C9E2', marginRight: '2' }} />
                        10 bình luận</span>
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
                        <input type="text" placeholder="Viết bình luận..." />
                        <button>
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
                            <div className="center-user-home-post-comment-list-item">
                                <div className="center-user-home-post-comment-list-item-avatar">
                                    <img src="https://via.placeholder.com/50" alt="avatar" />
                                </div>
                                <div className="center-user-home-post-comment-list-item-content">
                                    <div className="center-user-home-post-comment-list-item-content-user">
                                        <span>Username</span>
                                        <span>1 giờ trước</span>
                                    </div>
                                    <div className="center-user-home-post-comment-item-content-text">
                                        <pr>
                                            Trên Facebook, khi bạn đăng bài trong một nhóm mà bài viết của bạn không được duyệt, thông thường bạn sẽ nhận được một thông báo từ Facebook thông báo rằng bài viết của bạn đã bị từ chối hoặc không được chấp nhận. Nội dung thông báo này thường sẽ bao gồm lý do tại sao bài đăng của bạn không được duyệt, nếu quản trị viên hoặc người kiểm duyệt nhóm đã cung cấp lý do.

                                            Thông báo này có thể xuất hiện dưới dạng:

                                            Thông báo trong ứng dụng: Bạn sẽ thấy một thông báo trong mục thông báo của bạn trên Facebook, có thể có nội dung như: "Bài viết của bạn trong nhóm [Tên nhóm] đã bị từ chối."

                                            Thông báo qua email: Nếu bạn đã bật thông báo qua email cho hoạt động nhóm, bạn có thể nhận được email từ Facebook với thông tin về bài đăng bị từ chối.

                                            Tin nhắn trực tiếp từ quản trị viên nhóm: Trong một số trường hợp, quản trị viên hoặc người kiểm duyệt nhóm có thể gửi cho bạn một tin nhắn trực tiếp giải thích lý do bài viết không được duyệt.

                                            Nội dung và hình thức của thông báo có thể khác nhau tùy thuộc vào cài đặt nhóm và cách quản trị viên nhóm xử lý bài viết.
                                        </pr>
                                    </div>
                                    <div className="center-user-home-post-comment-item-content-action">
                                        <button>Thích</button>
                                        <button>Trả lời</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>

                )}
            </div>
        </div>
    )
}

export default ItemPostUserHome;