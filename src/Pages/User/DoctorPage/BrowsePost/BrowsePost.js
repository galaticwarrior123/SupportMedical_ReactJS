import './BrowsePost.css';
import ItemPostUserHome from '../../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useState, useEffect } from 'react';
import PostAPI from '../../../../API/PostAPI';
import DefaultLayout from '../../../../Layouts/DefaultLayout/DefaultLayout';
import RejectedPost from '../RejectedPost/RejectedPost';
import PostDetail from '../../HomePage/CenterUserHome/PostDetail/PostDetail';


const BrowsePost = () => {
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [isShowFormRejected, setIsShowFormRejected] = useState(false);
    const [rejectedPostId, setRejectedPostId] = useState('');
    const [selectedPostDetail, setSelectedPostDetail] = useState(null);
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await PostAPI.getAllPost();
            const pendingPosts = response.data.filter(post => post.status === "PENDING" && post.tags.some(tag => tag._id === user.doctorInfo.specialities[0]));
            const sortedListPost = pendingPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedListPost);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCloseFormRejectedPost = () => {
        setIsShowFormRejected(false);
        setRejectedPostId('');
        setSelectedPostDetail(null);
        fetchPosts();
    }

    const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(item => item._id !== postId));
    };


    return (
        <>
            {isShowFormRejected && (
                <RejectedPost handleCloseFormRejectedPost={handleCloseFormRejectedPost} postId={rejectedPostId} />
            )}
            {selectedPostDetail && (
                <PostDetail
                    itemPost={selectedPostDetail}
                    handleCloseFullScreen={() => setSelectedPostDetail(null)}
                    onDeletePost={handleDeletePost}
                    onClickShowFormRejected={() => {
                        setRejectedPostId(selectedPostDetail._id);
                        setIsShowFormRejected(true);
                    } }
                />
            )}

            <DefaultLayout>
                <div className="browsePost">
                    <div className="browsePost_list">
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <ItemPostUserHome
                                    key={index}
                                    itemPost={post}
                                    currentUser={user}
                                    onDelete={handleDeletePost}
                                    onClickShowFormRejected={() => {
                                        setRejectedPostId(post._id);
                                        setIsShowFormRejected(true);
                                    }}
                                    onClickSeeDetail={() => setSelectedPostDetail(post)} 
                                    onCloseDetail={() => setSelectedPostDetail(null)}
                                />
                            ))
                        ) : (
                            <div className='no-post-permission'>
                                <span>Không có bài viết nào</span>
                            </div>
                        )}
                    </div>
                </div>
            </DefaultLayout>
        </>


    )
}

export default BrowsePost;