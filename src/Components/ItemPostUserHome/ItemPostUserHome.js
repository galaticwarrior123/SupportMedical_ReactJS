import './ItemPostUserHome.css';
import PostDetail from '../../Pages/User/HomePage/CenterUserHome/PostDetail/PostDetail';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsUp, faComment, faPaperPlane, faArrowRight, faArrowLeft, faEarth, faEllipsis, faHeart, faSurprise, faImage, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, set } from 'date-fns';
import ShowPostDetailLike from './ShowPostDetailLike';
import { is, se, vi } from 'date-fns/locale';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PostAPI from '../../API/PostAPI';
import CommentAPI from '../../API/CommentAPI';
import ShowComment from './ShowComment';
import ShowMore from './ShowMore';
import ReactionMenu from './ReactionMenu';
import { DepartmentAPI } from '../../API/DepartmentAPI';
import ShowMoreListLikeComment from './ShowMoreListLikeComment';

const ItemPostUserHome = ({ itemPost, currentUser, isPostDetail = false, onDelete, onClickShowFormRejected, onClickSeeDetail, onCloseDetail }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [post, setPost] = useState({});
    const [liked, setLiked] = useState(false);
    const [loved, setLoved] = useState(false);
    const [surprised, setSurprised] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [clickComment, setClickComment] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showPostDetail, setShowPostDetail] = useState(false);
    const [numberOfInteracts, setNumberOfInteracts] = useState(itemPost?.likedBy?.length + itemPost?.lovedBy?.length + itemPost?.surprisedBy?.length || 0);
    const [numberOfComments, setNumberOfComments] = useState(itemPost?.totalComments || 0);
    const [showPostDetailLike, setShowPostDetailLike] = useState(false);
    const [likedByUsers, setLikedByUsers] = useState(itemPost?.likedBy || []);
    const [lovedByUsers, setLovedByUsers] = useState(itemPost?.lovedBy || []);
    const [surprisedByUsers, setSurprisedByUsers] = useState(itemPost?.surprisedBy || []);
    const [listComment, setListComment] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const location = useLocation();
    const [showMore, setShowMore] = useState(false);
    const [longPressTimeout, setLongPressTimeout] = useState(null);
    const [currentReaction, setCurrentReaction] = useState(null);
    const [longPressActive, setLongPressActive] = useState(false);
    const images = itemPost?.images || [];
    const [tags, setTags] = useState(itemPost?.tags || []);
    const reactionsMenuRef = useRef(null);
    const [listDepartment, setListDepartment] = useState([]);
    const [showListLikeComment, setShowListLikeComment] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await DepartmentAPI.getAll();
                setListDepartment(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const numberOfInteracts = likedByUsers.length + lovedByUsers.length + surprisedByUsers.length;
        setNumberOfInteracts(numberOfInteracts);
        fetchListComment();
        fetchPost();

    }, [itemPost._id]);

    useEffect(() => {
        if (currentReaction !== null) {
            handleReaction();
        }

    }, [currentReaction]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (reactionsMenuRef.current && !reactionsMenuRef.current.contains(event.target)) {
                setShowReactions(false);
            }
        };

        if (showReactions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showReactions]);

    const fetchListComment = async () => {
        try {
            const response = await CommentAPI.getCommentByPostId(itemPost._id);
            const sortedListComment = response.data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setListComment(sortedListComment);
            setNumberOfComments(response.data.totalComments || 0);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await PostAPI.getPostById(itemPost._id);
            const postData = response.data[0];
            setPost(response.data[0]);
            setNumberOfInteracts(postData.likedBy.length + postData.lovedBy.length + postData.surprisedBy.length);
            setLikedByUsers(response.data[0].likedBy);
            setLovedByUsers(response.data[0].lovedBy);
            setSurprisedByUsers(response.data[0].surprisedBy);



            if (currentUser) {
                // kiểm tra bài post có mình thả cảm xúc chưa 
                if (postData.likedBy.find(user => user._id === currentUser._id)) {
                    setLiked(true);
                }
                if (postData.lovedBy.find(user => user._id === currentUser._id)) {
                    setLoved(true);
                }
                if (postData.surprisedBy.find(user => user._id === currentUser._id)) {
                    setSurprised(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handlePostComment = async (postId) => {
        const data = new FormData();
        data.append('content', commentContent);
        data.append('userId', user._id);
        data.append('postId', postId);
        if (selectedImageComment) {
            data.append('imageContent', selectedImageComment);
        }
        try {
            const newComment = await CommentAPI.createComment(data);

            // cập nhật ngay bình luận mới vào danh sách bình luận
            setListComment((prevListComment) => [newComment.data, ...prevListComment]);

            fetchListComment();


            // Cập nhật số lượng bình luận
            setNumberOfComments((prevCount) => prevCount + 1);

            // Hiển thị thông báo thành công
            toast.success('Bình luận thành công');
        } catch (error) {
            // Hiển thị thông báo lỗi
            toast.error('Bình luận thất bại');
        }
    };


    const handleReaction = async () => {
        const reaction = currentReaction; // Có thể là 'like', 'love', hoặc 'surprise'
        // nếu trường hợp là
        let data = { type: reaction };
        let interactChange = 0; // Biến này theo dõi sự thay đổi số lượng tương tác
        console.log("reaction: ", reaction);
        try {
            // Nếu người dùng đã tương tác với bài viết (like, love, surprise)
            if (reaction === 'love' && loved) {
                data = { type: null }; // Xóa tương tác
                setLoved(false); // Xóa trạng thái yêu
                setLiked(false); // Trả về nút like nguyên bản
                setSurprised(false); // Xóa trạng thái ngạc nhiên
                setLovedByUsers(prev => prev.filter(user => user._id !== currentUser._id)); // Xóa user khỏi danh sách loved
                interactChange = -1; // Giảm số lượng tương tác
                setCurrentReaction(null);
            } else if (reaction === 'like' && liked) {
                data = { type: null }; // Xóa tương tác
                setLiked(false); // Trả về nút like nguyên bản
                setLoved(false); // Xóa trạng thái yêu
                setSurprised(false); // Xóa trạng thái ngạc nhiên
                setLikedByUsers(prev => prev.filter(user => user._id !== currentUser._id)); // Xóa user khỏi danh sách liked
                interactChange = -1;
                setCurrentReaction(null);
            } else if (reaction === 'surprise' && surprised) {
                data = { type: null }; // Xóa tương tác
                setSurprised(false); // Xóa trạng thái ngạc nhiên
                setLiked(false); // Trả về nút like nguyên bản
                setLoved(false); // Xóa trạng thái yêu
                setSurprisedByUsers(prev => prev.filter(user => user._id !== currentUser._id)); // Xóa user khỏi danh sách surprised
                interactChange = -1;
                setCurrentReaction(null);
            } else {
                // Nếu chưa có tương tác nào, thêm tương tác mới
                if (reaction === 'like') {
                    setLiked(true); // Thiết lập trạng thái like
                    setLikedByUsers(prev => [...prev, currentUser]); // Thêm user vào danh sách liked
                    interactChange = loved || surprised ? 0 : 1; // Nếu trước đó đã có love hoặc surprise, không tăng số tương tác
                    setLoved(false); // Xóa trạng thái yêu
                    setSurprised(false); // Xóa trạng thái ngạc nhiên
                    setCurrentReaction(null);
                } else if (reaction === 'love') {
                    setLoved(true); // Thiết lập trạng thái love
                    setLovedByUsers(prev => [...prev, currentUser]); // Thêm user vào danh sách loved
                    interactChange = liked || surprised ? 0 : 1;
                    setLiked(false); // Xóa trạng thái like
                    setSurprised(false); // Xóa trạng thái ngạc nhiên
                    setCurrentReaction(null);
                } else if (reaction === 'surprise') {
                    setSurprised(true); // Thiết lập trạng thái surprise
                    setSurprisedByUsers(prev => [...prev, currentUser]); // Thêm user vào danh sách surprised
                    interactChange = liked || loved ? 0 : 1;
                    setLiked(false); // Xóa trạng thái like
                    setLoved(false); // Xóa trạng thái yêu
                    setCurrentReaction(null);
                }
            }

            // Cập nhật số lượng tương tác trực tiếp ngay khi có thay đổi
            if (interactChange !== 0) {
                setNumberOfInteracts(numberOfInteracts + interactChange);
            }

            // Gửi yêu cầu cập nhật lên server
            await PostAPI.reactPost(itemPost._id, data);

            fetchPost();

        } catch (error) {
            console.error(error);
        }
    };





    const handleReactionSelect = (newReaction) => {
        setCurrentReaction(newReaction);
        setShowReactions(false);
    };

    const handleMouseDown = () => {
        // Set longPressActive to false initially
        setLongPressActive(false);

        // Set a timeout for long press (500ms)
        const timeout = setTimeout(() => {
            setShowReactions(true); // Show reactions menu after long press
            setLongPressActive(true); // Indicate long press is active
        }, 500);
        setLongPressTimeout(timeout);


    };

    const handleMouseUp = async () => {
        // Clear long press timeout when mouse is released
        clearTimeout(longPressTimeout);

        // If long press is not active, proceed with the normal reaction button click
        if (!longPressActive) {

            //handleReaction();

            // nếu đó là lần đầu tiên thì nếu chưa thả cảm xúc thì sẽ là nút like màu xanh dương còn nếu đã thả cảm xúc rồi thì sẽ là nút like màu đen và cập nhật lại số lượng cảm xúc
            if (liked) {
                setLiked(false);
                setNumberOfInteracts(numberOfInteracts - 1);
                await PostAPI.reactPost(itemPost._id, { type: null });
            } else if (loved) {
                setLoved(false);
                setNumberOfInteracts(numberOfInteracts - 1);
                await PostAPI.reactPost(itemPost._id, { type: null });
            } else if (surprised) {
                setSurprised(false);
                setNumberOfInteracts(numberOfInteracts - 1);
                await PostAPI.reactPost(itemPost._id, { type: null });
            } else {
                setLiked(true);
                setNumberOfInteracts(numberOfInteracts + 1);
                await PostAPI.reactPost(itemPost._id, { type: 'like' });
            }
        }
    };


    const handleCloseReactionMenu = () => {
        setShowReactions(false);
    };



    const handleComment = () => {
        setClickComment(!clickComment);

        // nếu mà gủi bình luận ở chế độ show hết comment sau khi gửi phải hiện liền ngay bình luận mới nhất lên
        if (clickComment) {
            setListComment([...listComment].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
    };

    const handleUpdateCountComment = () => {
        setNumberOfComments(numberOfComments + 1);
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
        //fetchPost();

    };
    const handleCloseFullScreen = () => {
        setShowPostDetail(false);
        setShowPostDetailLike(false);
        fetchPost();

        setLiked(false);
        setLoved(false);
        setSurprised(false);

    }

    const handleSeeDetailLike = () => {
        setShowPostDetailLike(true);


    }

    const handleShowMore = () => {
        setShowMore(!showMore);
    }


    const [selectedImageComment, setSelectedImageComment] = useState(null);
    const [showImageComment, setShowImageComment] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setSelectedImageComment(file);
        setShowImageComment(true);
    };

    const handleDeleteImage = () => {
        setSelectedImageComment(null);
        setShowImageComment(false);
    };

    const handleSubmitComment = () => {
        if (!commentContent && !selectedImageComment) {
            toast.error('Vui lòng nhập nội dung bình luận hoặc phản hồi.');
            return;
        }
        handlePostComment(itemPost._id, commentContent, selectedImageComment);
        setCommentContent("");
        setSelectedImageComment(null);
        setShowImageComment(false);
    };

    const formattedTime = (() => {
        const date = new Date(itemPost.createdAt);
        if (isNaN(date.getTime())) {
            return 'Ngày không hợp lệ';
        }

        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays <= 5) {
            return formatDistanceToNow(date, { addSuffix: true, locale: vi });
        } else {
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    })();

    const renderBadge = () => {
        if (itemPost.author?.roles.includes('DOCTOR')) {
            return <span className="center-user-home-post-badge"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Bác sĩ</span>;
        }
        // else if (itemPost.author.roles.includes('NURSE')) {
        //     return <span className="center-user-home-post-badge"><FontAwesomeIcon icon={faCheck} style={{ color: 'blue' }} /> Y tá</span>;
        // } else if (itemPost.author.roles.includes('CLIENT')) {
        //     return <span className="center-user-home-post-badge"><FontAwesomeIcon icon={faCheck} style={{ color: 'gray' }} /> Khách hàng</span>;
        // }
        return null; // No badge for other roles
    };


    const renderButtonReaction = () => {
        let reactionButton;
        if (liked) {
            reactionButton = (
                <button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    style={{ color: 'blue' }}>
                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'blue', marginRight: '2' }} />
                    <span>Thích</span>
                </button>
            );
        }
        else if (loved) {
            reactionButton = (
                <button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    style={{ color: 'red' }}>
                    <FontAwesomeIcon icon={faHeart} style={{ color: 'red', marginRight: '2' }} />
                    <span>Yêu</span>
                </button>
            );
        }
        else if (surprised) {
            reactionButton = (
                <button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    style={{ color: 'orange' }}>
                    <FontAwesomeIcon icon={faSurprise} style={{ color: 'orange', marginRight: '2' }} />
                    <span>Ngạc nhiên</span>
                </button>
            );
        }
        else {
            reactionButton = (
                <button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'black', marginRight: '2' }} />
                    <span>Thích</span>
                </button>
            );
        }

        return reactionButton;
    };


    const handlePublishPost = async (postId, status) => {
        if (user.doctorInfo.isPermission === false) {
            toast.error('Bạn không có quyền thực hiện chức năng này');
            return;
        }

        try {
            await PostAPI.updateStatusPost(postId, { status });

            if (isPostDetail && status === 'PUBLISHED') {
                onCloseDetail();
            }

            onDelete(postId); // Gọi hàm onDelete để xóa bài viết khỏi danh sách

            // Hiển thị thông báo sau khi toàn bộ thao tác thành công
            toast.success(
                status === 'PUBLISHED'
                    ? 'Phê duyệt bài viết thành công'
                    : 'Từ chối bài viết thành công'
            );
        } catch (error) {
            console.error(error);
            toast.error('Cấp quyền bài viết thất bại');
        }
    };

    const [commentDetailId, setCommentDetailId] = useState(null);
    const handleShowMoreLikeComment = (id) => {
        setShowListLikeComment(!showListLikeComment);
        setCommentDetailId(id);
    }



    return (
        <div className="center-user-home-post">
            <div className="center-user-home-post-header">
                <div className="center-user-home-post-avatar">
                    <img src={itemPost.author?.avatar} alt="avatar" />
                </div>
                <div className="center-user-home-post-user-info">
                    <div className="center-user-home-post-user-info-top">
                        <div className="center-user-home-post-user-info-top-name">
                            <Link to={`/forum/profile/${itemPost.author?._id}`}>
                                <span>{itemPost.author?.firstName} {itemPost.author?.lastName}</span>
                            </Link>
                            {renderBadge()}
                        </div>
                        <div>
                            {location.pathname === '/forum/profile/' + user._id && (
                                <>
                                    <div className="center-user-home-post-user-info-top-action">
                                        <button onClick={handleShowMore}><FontAwesomeIcon icon={faEllipsis} style={{ color: 'gray' }} /></button>

                                    </div>
                                    {showMore && <ShowMore itemPost={itemPost} onDelete={onDelete} />}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="center-user-home-post-date">
                        <span>{formattedTime}</span>
                        {/* {location.pathname === '/profile/' + itemPost.author._id && (
                            <span className="center-user-home-post-privacy"><FontAwesomeIcon icon={faEarth} style={{ color: 'gray' }} /> Công khai</span>
                        )} */}
                    </div>
                </div>

            </div>
            {/* {showPostDetail && 
                <PostDetail 
                    handleCloseFullScreen={handleCloseFullScreen} 
                    itemPost={post}  />} */}
            <div className="center-user-home-post-categories">
                {tags.length === listDepartment.length ? (
                    <span className="center-user-home-post-category cate1">Tất cả</span>
                ) : (
                    tags.map((tag, index) => (
                        <span key={index} className="center-user-home-post-category cate1">{tag.name}</span>
                    ))
                )}


            </div>
            {location.pathname === '/post/' + itemPost._id ? (
                <>
                    {/* <div className="center-user-home-post-categories">
                        {tags.length === listDepartment.length ? (
                            <span className="center-user-home-post-category cate1">Tất cả</span>
                        ) : (
                            tags.map((tag, index) => (
                                <span key={index} className="center-user-home-post-category cate1">{tag.name}</span>
                            ))
                        )}


                    </div> */}
                    <div className='center-user-home-post-content-title-detail'>
                        <div className="center-user-home-post-content-detail" style={{ whiteSpace: 'pre-line' }}>
                            <span>{itemPost.content}</span>
                        </div>
                        <div className="center-user-home-post-title-detail" style={{ whiteSpace: 'pre-line' }}>
                            {itemPost.title}
                        </div>
                    </div>
                </>

            ) : (
                <>
                    {/* <div className="center-user-home-post-categories">
                        {tags.length === listDepartment.length ? (
                            <span className="center-user-home-post-category cate1">Tất cả</span>
                        ) : (
                            tags.map((tag, index) => (
                                <span key={index} className="center-user-home-post-category cate1">{tag.name}</span>
                            ))
                        )}
                    </div> */}

                    <div className="center-user-home-post-title">
                        {isPostDetail ? (
                            <>
                                {itemPost.content}
                            </>

                        ) : (
                            <>

                                {itemPost.title}
                                {isPostDetail === false && (
                                    <span onClick={onClickSeeDetail}>Xem chi tiết...</span>
                                )}
                            </>
                        )}
                    </div>
                </>

            )}

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
            {showReactions &&
                <div className="center-user-home-post-reaction-menu" ref={reactionsMenuRef}>
                    <ReactionMenu onReactionSelect={handleReactionSelect} />
                </div>}
            {(location.pathname === '/forum/profile/' + itemPost.author?._id) || (location.pathname === '/forum/search') || (location.pathname === '/forum') || (location.pathname === '/forum/post/' + itemPost._id) ? (
                <div className="center-user-home-post-footer">

                    <div className="center-user-home-post-footer-infoPost">
                        <div className='center-user-home-post-footer-infoPost-like' onClick={handleSeeDetailLike}>
                            <span>
                                <FontAwesomeIcon icon={faThumbsUp} style={{ color: '#41C9E2', marginRight: '2' }} />
                                <FontAwesomeIcon icon={faHeart} style={{ color: '#FF0000' }} />
                                <FontAwesomeIcon icon={faSurprise} style={{ color: '#FFCC33' }} />
                                <span style={{ marginLeft: 5 }}>{numberOfInteracts} </span>
                            </span>
                        </div>
                        {showPostDetailLike && <ShowPostDetailLike handleCloseFullScreen={handleCloseFullScreen} itemPost={post} />}
                        <span><FontAwesomeIcon icon={faComment} style={{ color: '#41C9E2', marginRight: '2' }} />
                            {numberOfComments} bình luận</span>
                    </div>

                    <div className="center-user-home-post-footer-action">

                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        {renderButtonReaction()}

                                    </td>

                                    <td><button onClick={handleComment}>
                                        <FontAwesomeIcon icon={faComment} style={{ color: 'black', marginRight: '2' }} />
                                        Xem bình luận</button></td>
                                </tr>

                            </tbody>

                        </table>

                    </div>
                    <div className="center-user-home-post-footer-comment">
                        <div className="center-user-home-post-comment-avatar">
                            <img src={JSON.parse(localStorage.getItem('user')).avatar} alt="avatar" />
                        </div>
                        <div className="center-user-home-post-comment-input">
                            <input
                                type="text"
                                placeholder="Viết bình luận..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <div className="comment-icons">
                                <label htmlFor={`image-upload-${itemPost._id}`} className="image-upload-label">
                                    <FontAwesomeIcon icon={faImage} style={{ color: 'silver', cursor: 'pointer' }} />
                                </label>
                                <input
                                    id={`image-upload-${itemPost._id}`}
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <button onClick={handleSubmitComment}>
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'silver' }} />
                                </button>

                            </div>
                        </div>
                    </div>
                    {showImageComment && (
                        <div className="image-preview">
                            <div className="image-preview-title">
                                <img src={URL.createObjectURL(selectedImageComment)} alt="preview" />
                                <button className="delete-image-btn" onClick={handleDeleteImage}>
                                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', cursor: 'pointer' }} />
                                </button>
                            </div>
                        </div>
                    )}
                    {showListLikeComment && (<ShowMoreListLikeComment commentId={commentDetailId} handleCloseShowMoreListLikeComment={handleShowMoreLikeComment} />)}
                    {clickComment && (
                        <>
                            <div className="center-user-home-post-comment-title">
                                <span>Danh sách bình luận</span>
                            </div>
                            <div className="center-user-home-post-comment-list">
                                {listComment.length > 0 ? (
                                    <ShowComment listComment={listComment} countComment={handleUpdateCountComment} onClickShowListLikeComment={handleShowMoreLikeComment} />
                                ) : (
                                    <div className="center-user-home-post-comment-list-item">
                                        <span>Không có bình luận nào</span>
                                    </div>
                                )}

                            </div>
                        </>

                    )}
                </div>
            ) : (location.pathname === '/forum/permission') && (
                <div className="center-user-home-post-footer-browser">
                    <div className="center-user-home-post-footer-browser-body">
                        <table>
                            <tr>
                                <td>
                                    <button className="center-user-home-post-footer-browser-body-button-acess" onClick={() => handlePublishPost(itemPost._id, "PUBLISHED")}>
                                        <span>Phê duyệt</span>
                                    </button>
                                </td>
                                <td>
                                    <button className='center-user-home-post-footer-browser-body-button-deny' onClick={onClickShowFormRejected}>
                                        <span>Từ chối</span>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default ItemPostUserHome;



//() => handlePublishPost(itemPost._id, "REJECTED")