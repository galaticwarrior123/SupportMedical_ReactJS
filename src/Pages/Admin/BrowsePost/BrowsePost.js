import './BrowsePost.css';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useState, useEffect } from 'react';
import PostAPI from '../../../API/PostAPI';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { ToastContainer } from 'react-toastify';
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
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="browsePost">
                    <ToastContainer/>
                    <div className="browsePost_list">
                        {
                            posts.map((post, index) => (
                                post.isPublished === false && 
                                post.tags.some(tag => tag._id === user.doctorInfo.specialities[0]) && 
                                <ItemPostUserHome key={index} itemPost={post} />
                            ))
                        }
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>

    )
}

export default BrowsePost;