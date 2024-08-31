import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import AboutProfile from './AboutProfile/AboutProfile';
import FollowersProfile from './FollowersProfile/FollowersProfile';
import HeaderProfile from './HeaderProfile/HeaderProfile';
import {useState,useEffect} from 'react';
import PostAPI from '../../../API/PostAPI';
import './ProfileUserPage.css';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProfileUserPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [listPostUser, setListPostUser] = useState([]);
    
    useEffect(() => {
        fetchPostByUserId();
    }, []);

    const fetchPostByUserId = async () => {
        try {
            const response = await PostAPI.getPostByUserId(user._id);
            const sortedListPost = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setListPostUser(sortedListPost);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePostDelete = (deletedPostId) => {
        setListPostUser(prevList => prevList.filter(post => post._id !== deletedPostId));
    }

    return (
        <DefaultLayout>
            <ToastContainer style={{ position: 'fixed', top: 60, right: 20 }} />
            <div className="profile-page-profile">
                <HeaderProfile user={user}/>
                <div className="profile-content-profile">
                    <div className="left-side-profile">
                        <AboutProfile />
                        <FollowersProfile />
                    </div>
                    <div className="right-side-profile">
                        {listPostUser.length > 0 ? listPostUser.map((post) => (
                            <ItemPostUserHome key={post._id} itemPost={post} currentUser={user} onDelete={handlePostDelete}/>
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