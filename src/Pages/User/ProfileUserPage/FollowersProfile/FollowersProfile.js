import { Link } from 'react-router-dom';
import './FollowersProfile.css';

const FollowersProfile = ({ user, currentUser }) => {
    return (
        <div className="followers-container-profile">
            <h3>Được theo dõi bởi</h3>
            <div className="followers-list-profile">
                {user.following && user.following.length > 0 ? (
                    user.following.map((follower) => (
                        <div className="follower-profile" key={follower._id}>
                            <img src={follower.avatar} alt="avatar" className="follower-picture-profile" />
                            <Link to={`/profile/${follower._id}`} className="follower-username-profile">
                                <p>{follower.firstName} {follower.lastName}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="no-followers-message">Chưa có người theo dõi nào.</p>
                )}
            </div>
            {/* <a href="#" className="view-all-profile">Xem tất cả</a> */}
        </div>
    );
}

export default FollowersProfile;