import './HeaderProfile.css'
import { UserAPI } from '../../../../API/UserAPI';
import { useEffect, useState } from 'react';
import { is } from 'date-fns/locale';
import { useLocation, useNavigate } from 'react-router-dom';
import UpdateProfileUser from '../UpdateProfileUser/UpdateProfileUser';
import { ChatAPI } from '../../../../API/ChatAPI';
const HeaderProfile = ({ user, onUserUpdate, onFollowToggle }) => {
    const navigate = useNavigate();
    const [isFollowed, setIsFollowed] = useState(false);
    const [isMe, setIsMe] = useState(false);
    const [isProfileUpdate, setIsProfileUpdate] = useState(false);
    const [userData, setUserData] = useState(user);
    const [numberOfFollowers, setNumberOfFollowers] = useState(0);
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        checkProfileMe();
        fetchUserById();
    }, [location]);


    const handleFollowUser = () => {
        UserAPI.followUser(user._id);
        setIsFollowed(!isFollowed);
        if (isFollowed) {
            setNumberOfFollowers(numberOfFollowers - 1);
            onFollowToggle(user._id, false);
        } else {
            setNumberOfFollowers(numberOfFollowers + 1);
            onFollowToggle(user._id, true);
        }
    }
    const checkProfileMe = () => {
        const user_id = location.pathname.split('/')[2];
        if (localStorage.getItem('user')) {
            const userLocal = JSON.parse(localStorage.getItem('user'));
            if (userLocal._id === user_id) {
                setIsMe(true);
            }
        }
    }
    const handleUpdateProfileUser = () => {
        setIsProfileUpdate(true);
    }

    const fetchUserById = async () => {
        try {
            const user_id = location.pathname.split('/')[2];
            const response = await UserAPI.getUserById(user_id);
            setUserData(response.data);
            setNumberOfFollowers(response.data.following.length);
            // kiểm tra người dùng đã theo dõi chưa
            if (localStorage.getItem('user')) {
                const userLocal = JSON.parse(localStorage.getItem('user'));
                for (let i = 0; i < response.data.following.length; i++) {
                    if (response.data.following[i]._id === userLocal._id) {
                        setIsFollowed(true);
                        break;
                    }
                }
            }


        } catch (error) {
            console.error(error);
        }
    }

    const handleCloseUpdateProfile = () => {
        setIsProfileUpdate(false);
        fetchUserById()
        onUserUpdate(currentUser);
    }

    const handleUserUpdated = (updatedUser) => {
        onUserUpdate(updatedUser);
        fetchUserById();
    }

    const handlePrivateChat = async () => {
        const response = await ChatAPI.getPrivateChat(user._id);
        navigate(`/chat/${response.data._id}`);
    }
    return (
        <div className="profile-header-container">
            <div className="profile-header-banner-profile">
                <img src={userData.avatar} alt="Banner" />
            </div>
            <div className="profile-header-info-profile">
                <div className="profile-avatar-profile">
                    <img src={userData.avatar} alt="Avatar" />
                </div>
                <div className="profile-header-text">
                    <h2 className="profile-username">
                        {userData.firstName} {userData.lastName}
                        {userData.roles?.includes('DOCTOR') ? 
                            <span className="user-doctor-badge">
                                <span className="doctor-icon">✔️</span> Bác sĩ
                            </span> : ''
                        }
                    </h2>
                    <p className="profile-followers">{numberOfFollowers} đang theo dõi</p>
                </div>
                <div className="profile-header-actions" style={{ marginLeft: 'auto' }}>
                    {isProfileUpdate ?
                        <UpdateProfileUser handleCloseUpdateProfile={handleCloseUpdateProfile} fetchByUserId={fetchUserById} onUserUpdate={handleUserUpdated} />
                        :
                        ''
                    }
                    {isMe ? (
                        <button className="profile-follow-button" onClick={handleUpdateProfileUser}>Cập nhật thông tin</button>
                    ) : (
                        <>
                            <button onClick={handlePrivateChat} className="profile-message-button">Nhắn tin</button>
                            {isFollowed ? (
                                <>
                                    <button className="profile-follow-button" onClick={handleFollowUser}>Hủy theo dõi</button>
                                </>
                            ) : (
                                <button className="profile-follow-button" onClick={handleFollowUser}>Theo dõi</button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>


    );
}

export default HeaderProfile;