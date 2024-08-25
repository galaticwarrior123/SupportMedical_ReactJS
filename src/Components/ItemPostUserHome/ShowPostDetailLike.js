import './ShowPostDetailLike.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';



const ShowPostDetailLike = ({ handleCloseFullScreen, listUserLiked }) => {
    const [allUserLiked, setAllUserLiked] = useState([]);

    useEffect(() => {
        setAllUserLiked(listUserLiked);
    }, [listUserLiked]);

    return (
        <div className="show-post-detail-like" onClick={handleCloseFullScreen}>
            <div className="show-post-detail-like-body" onClick={(e) => e.stopPropagation()}>
                <div className="show-post-detail-like-body-title">
                    <span>Người đã thích bài viết</span>
                    <button onClick={handleCloseFullScreen}>
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
                <div className="show-post-detail-like-body-list">
                    {listUserLiked.length >0 ? allUserLiked.map((user) => (
                        <div key={user._id} className="show-post-detail-like-body-list-item">
                            <img src="https://via.placeholder.com/50" alt="avatar" />
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    )) : <div className="show-post-detail-like-body-list-item">
                        <span>Chưa có ai thích bài viết này</span>
                    </div>}

                </div>
            </div>
        </div>
    );
};

export default ShowPostDetailLike;