import React from 'react';
import './UserSearchItem.css';
import { useNavigate } from 'react-router-dom';

const UserSearchItem = ({ user, followUser }) => {
    const navigate = useNavigate();
    const isDoctor = user.roles && user.roles.includes('DOCTOR');

    const handleFollowUser = (e) => {
        e.stopPropagation();
        followUser(user._id);
    }
    return (
        <div onClick={() => navigate(`/profile/${user._id}`)} className="user-search-item">
            <img src={user.avatar} alt="Avatar" className="user-avatar" />
            <div className="user-info">
                <div className="user-details">
                    <span className="user-username">{`${user.firstName} ${user.lastName}`}</span>
                    {isDoctor && (
                        <span className="user-doctor-badge">
                            <span className="doctor-icon">✔️</span> Bác sĩ
                        </span>
                    )}
                </div>
                <p className="user-bio">{user?.email}</p>
            </div>
            <button onClick={handleFollowUser} className="follow-button">{user.isFollowing ? "Đang theo dõi" : "Theo dõi"}</button>
        </div>
    );
};

export default UserSearchItem;
