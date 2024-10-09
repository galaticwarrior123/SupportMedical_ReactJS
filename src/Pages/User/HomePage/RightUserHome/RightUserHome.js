import Calendar from './Calendar';
import './RightUserHome.css';
import { UserAPI } from '../../../../API/UserAPI';
import { useEffect, useState } from 'react';
import { all } from 'axios';
import { Link } from 'react-router-dom';

const RightUserHome = ({ onOpenDetailDay }) => {
    const [allFollowUser, setAllFollowUser] = useState([]);
    useEffect(() => {
        fetchAllFollowUser();
    }, []);

    const fetchAllFollowUser = async () => {
        try {
            const response = await UserAPI.getAll();
            if (response.status === 200) {
                const currentUser = JSON.parse(localStorage.getItem('user'))._id;
                let followedUsers = [];

                // Iterate through all users
                response.data.forEach((user) => {
                    // Check if the user has a following list
                    if (user.following.length > 0) {

                        // Check if the current user is being followed
                        user.following.forEach((followedUser) => {
                            if (followedUser._id === currentUser) {
                                followedUsers.push(user);
                            }
                        });
                    }
                });

                // Set all followed users at once
                setAllFollowUser(followedUsers);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="right-user-home">
            <div className="right-user-home-calendar">
                <Calendar onOpenDetailDay={onOpenDetailDay} />
            </div>
            <div className="right-user-home-follow">
                <div className="right-user-home-follow-header">
                    <span>Đang theo dõi</span>
                </div>
                <div className="right-user-home-follow-body">
                    {allFollowUser && allFollowUser.length > 0 ? allFollowUser.map((user) => (
                        <div key={user._id} className="right-user-home-follow-item">
                            <img src={user.avatar} alt="" />
                            <Link to={`/profile/${user._id}`}>
                                <span>{user.firstName} {user.lastName}</span>
                            </Link>
                        </div>
                    )) : <div className="right-user-home-follow-item">
                        <span>Chưa theo dõi </span>
                    </div>}

                    

                </div>
            </div>
        </div>
    )
}

export default RightUserHome;