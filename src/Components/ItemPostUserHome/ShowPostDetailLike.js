import './ShowPostDetailLike.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faHeart, faSurprise, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import PostAPI from '../../API/PostAPI';

const ShowPostDetailLike = ({ handleCloseFullScreen, itemPost }) => {
    const [allUserLiked, setAllUserLiked] = useState([]);
    const [allUserLoved, setAllUserLoved] = useState([]);
    const [allUserSurprised, setAllUserSurprised] = useState([]);
    const [activeReaction, setActiveReaction] = useState('all');

    useEffect(() => {
        fetchPost(itemPost._id);
        // setAllUserLiked(itemPost.likedBy);
        // setAllUserLoved(itemPost.lovedBy);
        // setAllUserSurprised(itemPost.surprisedBy);
    }, [itemPost]);

    const fetchPost = async (id) => {
        try {
            const response = await PostAPI.getPostById(id);
            if (response.status === 200) {
                setAllUserLiked(response.data[0].likedBy);
                setAllUserLoved(response.data[0].lovedBy);
                setAllUserSurprised(response.data[0].surprisedBy);
            }
        } catch (error) {
            console.log(error);
        }
    };

    
    const renderUserList = () => {
        if (activeReaction === 'like') {
            return allUserLiked.length > 0 ? allUserLiked.map((user) => (
                <div key={user._id} className="show-post-detail-like-body-list-item">
                    <img src="https://via.placeholder.com/50" alt="avatar" />
                    <span>{user.firstName} {user.lastName}</span>
                </div>
            )) : <div className="show-post-detail-like-body-list-item">
                <span>Chưa có ai thích bài viết này</span>
            </div>;
        } else if (activeReaction === 'love') {
            return allUserLoved.length > 0 ? allUserLoved.map((user) => (
                <div key={user._id} className="show-post-detail-like-body-list-item">
                    <img src="https://via.placeholder.com/50" alt="avatar" />
                    <span>{user.firstName} {user.lastName}</span>
                </div>
            )) : <div className="show-post-detail-like-body-list-item">
                <span>Chưa có ai yêu bài viết này</span>
            </div>;
        } else if (activeReaction === 'surprise') {
            return allUserSurprised.length > 0 ? allUserSurprised.map((user) => (
                <div key={user._id} className="show-post-detail-like-body-list-item">
                    <img src="https://via.placeholder.com/50" alt="avatar" />
                    <span>{user.firstName} {user.lastName}</span>
                </div>
            )) : <div className="show-post-detail-like-body-list-item">
                <span>Chưa có ai ngạc nhiên về bài viết này</span>
            </div>;
        } else {
            return [...allUserLiked, ...allUserLoved, ...allUserSurprised].length > 0 ? (
                [...allUserLiked, ...allUserLoved, ...allUserSurprised].map((user) => (
                    <div key={user._id} className="show-post-detail-like-body-list-item">
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                        <span>{user.firstName} {user.lastName}</span>
                    </div>
                ))
            ) : <div className="show-post-detail-like-body-list-item">
                <span>Chưa có ai tương tác với bài viết này</span>
            </div>;
        }
    };

    return (
        <div className="show-post-detail-like" onClick={handleCloseFullScreen}>
            <div className="show-post-detail-like-body" onClick={(e) => e.stopPropagation()}>
                <div className="show-post-detail-like-body-title">
                    <div className="show-post-detail-like-body-title-nav">
                        <button className={activeReaction==='all'? "active active-all":''} onClick={()=> setActiveReaction('all')}>
                            <span style={{fontSize:16}}>Tất cả</span>
                        </button>
                        <button className={activeReaction==='like'? "active active-like":''} onClick={()=> setActiveReaction('like')}>
                            <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'blue' }} />
                            <span style={{ marginLeft: 5, fontSize: 16 }}>{allUserLiked.length}</span>
                        </button>
                        <button className={activeReaction==='love'? "active active-love":''} onClick={()=> setActiveReaction('love')}>
                            <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} />
                            <span style={{ marginLeft: 5, fontSize: 16 }}>{allUserLoved.length}</span>
                        </button>
                        <button className={activeReaction==='surprise'? "active active-surprise":''} onClick={()=> setActiveReaction('surprise')}>
                            <FontAwesomeIcon icon={faSurprise} style={{ color: 'orange' }} />
                            <span style={{ marginLeft: 5, fontSize: 16 }}>{allUserSurprised.length}</span>
                        </button>
                    </div>
                    <button onClick={handleCloseFullScreen}>
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
                <div className="show-post-detail-like-body-list">
                    {/* {allUserLiked.length > 0 ? allUserLiked.map((user) => (
                        <div key={user._id} className="show-post-detail-like-body-list-item">
                            <img src="https://via.placeholder.com/50" alt="avatar" />
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    )) : <div className="show-post-detail-like-body-list-item">
                        <span>Chưa có ai thích bài viết này</span>
                    </div>} */}
                    {renderUserList()}

                </div>
            </div>
        </div>
    );
};

export default ShowPostDetailLike;