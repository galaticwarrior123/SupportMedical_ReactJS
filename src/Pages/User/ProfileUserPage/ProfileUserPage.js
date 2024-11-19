import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import AboutProfile from './AboutProfile/AboutProfile';
import FollowersProfile from './FollowersProfile/FollowersProfile';
import HeaderProfile from './HeaderProfile/HeaderProfile';
import {useState,useEffect} from 'react';
import PostAPI from '../../../API/PostAPI';
import './ProfileUserPage.css';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import 'react-toastify/dist/ReactToastify.css'
import { useLocation } from 'react-router-dom';
import { UserAPI } from '../../../API/UserAPI';

const ProfileUserPage = () => {
    const [listPostUser, setListPostUser] = useState([]);
    const location = useLocation();
    const [user, setUser] = useState({});
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
    const user_id = location.pathname.split('/')[2];

    useEffect(() => {
        fetchUserById();
        fetchPostByUserId();
    }, [location]);

    const fetchUserById = async () => {
        try {
            const response = await UserAPI.getUserById(user_id);
            setUser(response.data);
            
        } catch (error) {
            console.error(error);
        }
    }

    const fetchPostByUserId = async () => {
        try {
            const response = await PostAPI.getPostByUserId(user_id);
            const filteredListPost = response.data.filter(post => post.status === "PUBLISHED");
            const sortedListPost = filteredListPost.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setListPostUser(sortedListPost);
        } catch (error) {
            console.error(error);
        }
    }
    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);   
    }
    const handlePostDelete = (deletedPostId) => {
        setListPostUser(prevList => prevList.filter(post => post._id !== deletedPostId));
    }
    const handleFollowToggle = (followerId, isFollowing) => {
        setUser(prevUser => {
            const newFollowing = isFollowing 
                ? [...prevUser.following, currentUser ]
                : prevUser.following.filter(user => user._id !== currentUser._id);
            return { ...prevUser, following: newFollowing };
        });
    }
    return (
        <DefaultLayout>
            <div className="profile-page-profile">
                <HeaderProfile user={user} onUserUpdate={handleUserUpdate} onFollowToggle={handleFollowToggle}/>
                <div className="profile-content-profile">
                    <div className="left-side-profile">
                        <AboutProfile />
                        <FollowersProfile user={user} currentUser={currentUser}/>
                    </div>
                    <div className="right-side-profile">
                        {listPostUser.length > 0 ? listPostUser.map((post) => (
                            <ItemPostUserHome key={post._id} itemPost={post} currentUser={currentUser} onDelete={handlePostDelete}/>
                        )) : <div className="no-post">
                            <span>Chưa có bài viết nào</span>
                        </div>}
                    </div>
                </div>
            </div>
        </DefaultLayout>

    );
}

export default ProfileUserPage;