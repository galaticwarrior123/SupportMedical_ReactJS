import { useEffect, useState } from 'react';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Post.css';
import PostAPI from '../../../API/PostAPI';
import { useLocation } from 'react-router-dom';
import PostDetail from '../HomePage/CenterUserHome/PostDetail/PostDetail';
const Post = () => {
    const [post, setPost] = useState(null);
    const location = useLocation();
    const postId = location.pathname.split('/')[3];
    const user = JSON.parse(localStorage.getItem('user'));
    const [selectedPostDetail, setSelectedPostDetail] = useState(null);
    useEffect(() => {
        try {
            const fetchPost = async () => {
                const response = await PostAPI.getPostById(postId);
                console.log(response.data[0]);
                setPost(response.data[0]);
            }
            fetchPost();
        } catch (error) {
            console.error(error);
        }
    }, [postId]);

    return (
        <DefaultLayout>
            {selectedPostDetail && (
                <PostDetail
                    itemPost={selectedPostDetail}
                    handleCloseFullScreen={() => setSelectedPostDetail(null)}
                />
            )}
            <div className="post-container">
                <div className="post-container-body">
                    {post && <ItemPostUserHome itemPost={post} currentUser={user} onClickSeeDetail={() => setSelectedPostDetail(post)} />}
                </div>
            </div>
        </DefaultLayout>
    )

}

export default Post;