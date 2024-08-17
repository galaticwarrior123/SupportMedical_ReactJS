import ItemPostUserHome from '../../../../Components/ItemPostUserHome/ItemPostUserHome';
import './CenterUserHome.css';
import { useState } from 'react';
import CreatePost from './CreatePost/CreatePost';

const CenterUserHome = () => {
    const [isCreatePost, setIsCreatePost] = useState(false);

    const handleCreatePost = () => {
        setIsCreatePost(true);
    };

    const handleCloseCreatePost = () => {
        setIsCreatePost(false);
    };

    return (
        <div className="center-user-home">
            <div className="center-user-home-activity">
                <img src="https://via.placeholder.com/50" alt="avatar" />
                <div className="center-user-home-activity-input" onClick={handleCreatePost}>
                    <span>Bạn đang nghĩ gì</span>
                </div>
            </div>
            {isCreatePost && (
                <CreatePost handleCloseFullScreen={handleCloseCreatePost} />
            )}
            <div className="center-user-home-listPost">
                <ItemPostUserHome />
                <ItemPostUserHome />
            </div>
        </div>
    );
};

export default CenterUserHome;
