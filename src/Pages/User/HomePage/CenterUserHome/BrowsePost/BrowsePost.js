import './BrowsePost.css';
import ItemPostUserHome from '../../../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useState, useEffect } from 'react';
import PostAPI from '../../../../../API/PostAPI';
import DefaultLayout from '../../../../../Layouts/DefaultLayout/DefaultLayout';
const BrowsePost = () => {
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));


    useEffect(() => {
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
        fetchPosts();
    }, []);

    return (
        <DefaultLayout>
            <div className="browsePost">
                <div className="browsePost_list">
                    {
                        posts.map((post, index) => (
                            post.status === "PENDING" &&
                            post.tags.some(tag => tag._id === user.doctorInfo.specialities[0]) &&
                            <ItemPostUserHome key={index} itemPost={post} onDelete={() => {
                                setPosts(posts.filter(item => item._id !== post._id));
                             }} />
                        ))
                    }
                </div>
            </div>
        </DefaultLayout>

    )
}

export default BrowsePost;