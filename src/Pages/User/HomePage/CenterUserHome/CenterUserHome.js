import ItemPostUserHome from '../../../../Components/ItemPostUserHome/ItemPostUserHome';
import './CenterUserHome.css';
import { useState, useEffect } from 'react';
import CreatePost from './CreatePost/CreatePost';
import PostAPI from '../../../../API/PostAPI';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import PostDetail from './PostDetail/PostDetail';

const CenterUserHome = ({ isDetailDayOpen }) => {
    const [isCreatePost, setIsCreatePost] = useState(false);
    const [listPost, setListPost] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [selectedPostDetail, setSelectedPostDetail] = useState(null);

    const fetchListPost = async () => {
        try {
            const response = await PostAPI.getAllPost();
            const sortedListPost = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setListPost(sortedListPost);
        } catch (error) {
            toast.error('Lỗi lấy dữ liệu bài viết');
        }
    };
    useEffect(() => {
        fetchListPost();
    }, []);
    const handleCreatePost = () => {
        setIsCreatePost(true);
    };

    const handleCloseCreatePost = () => {
        setIsCreatePost(false);
        fetchListPost();
    };

    const updatePostInList = (updatedPost) => {
        setListPost((prevList) => {
            return prevList.map((post) =>
                post._id === updatedPost._id ? updatedPost : post
            );
        });
    };



    return (
        <div className="center-user-home" style={{ zIndex: isDetailDayOpen ? 0 : 2 }}>
            <div className="center-user-home-activity">
                <img src={JSON.parse(localStorage.getItem('user')).avatar} alt="avatar" />
                <div className="center-user-home-activity-input" onClick={handleCreatePost}>
                    <span>Bạn đang cần hỗ trợ gì?</span>
                </div>
            </div>
            {isCreatePost && (
                <CreatePost handleCloseFullScreen={handleCloseCreatePost} />
            )}

            {selectedPostDetail && (
                <PostDetail
                    itemPost={selectedPostDetail}
                    handleCloseFullScreen={() => setSelectedPostDetail(null)}
                />
            )}

            <div className="center-user-home-listPost">
                {listPost.length > 0 ? (
                    listPost.map((post) => (
                        post.status == "PUBLISHED" && (
                            <ItemPostUserHome key={post._id} itemPost={post} currentUser={user} onClickSeeDetail={() => setSelectedPostDetail(post)} />
                        )
                    ))
                ) : (
                    <div className="center-user-home-no-post">
                        <span>Không có bài viết nào</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CenterUserHome;
