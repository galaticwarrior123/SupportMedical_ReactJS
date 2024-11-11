import './BrowsePost.css';
import ItemPostUserHome from '../../../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useState, useEffect } from 'react';
import PostAPI from '../../../../../API/PostAPI';
import DefaultLayout from '../../../../../Layouts/DefaultLayout/DefaultLayout';
import RejectedPost from '../RejectedPost/RejectedPost';
const BrowsePost = () => {
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [isShowFormRejected, setIsShowFormRejected] = useState(false);
    const [rejectedPostId, setRejectedPostId] = useState('');
    useEffect(() => {
        
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await PostAPI.getAllPost();
            const sortedListPost = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedListPost);
            console.log(sortedListPost[0].tags)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCloseFormRejectedPost = () => {
        setIsShowFormRejected(false);
        fetchPosts();
    }

    return (
        <>
            {isShowFormRejected && (
                <RejectedPost handleCloseFormRejectedPost={handleCloseFormRejectedPost} postId={rejectedPostId} />
            )}
            <DefaultLayout>
                <div className="browsePost">
                    <div className="browsePost_list">
                        {
                            posts.map((post, index) => (
                                post.status === "PENDING" &&
                                post.tags.some(tag => tag._id === user.doctorInfo.specialities[0]) &&
                                <ItemPostUserHome key={index} itemPost={post} onDelete={() => {
                                    setPosts(posts.filter(item => item._id !== post._id));
                                }} onClickShowFormRejected={() => {
                                    setRejectedPostId(post._id);
                                    setIsShowFormRejected(true);
                                }} />
                            ))
                        }
                    </div>
                </div>
            </DefaultLayout>
        </>


    )
}

export default BrowsePost;