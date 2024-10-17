import './BrowsePost.css';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useState, useEffect } from 'react';
import PostAPI from '../../../API/PostAPI';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
const BrowsePost = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await PostAPI.getAllPost();
                const sortedListPost = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(sortedListPost);
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

                    <div className="browsePost_list">
                        {
                            posts.map((post, index) => (
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