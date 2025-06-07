import { Link, useNavigate } from 'react-router-dom';
import './FollowersProfile.css';

const FollowersProfile = ({ user, currentUser }) => {
    const navigate = useNavigate();

    const handleRedirectProfile = (id) => {
        navigate(`/forum/profile/${id}`);
        window.location.reload();
    }   

    return (
        <div className="followers-container-profile">
            <h3>Được theo dõi bởi</h3>
            <div className="followers-list-profile">
                {user.following && user.following.length > 0 ? (
                    user.following.map((follower) => (
                        <div className="follower-profile" key={follower._id}>
                            <img src={follower.avatar} alt="avatar" className="follower-picture-profile" />
                            {/* <Link to={`/profile/${follower._id}`} className="follower-username-profile">
                                <p>{follower.firstName} {follower.lastName}</p>
                            </Link> */}

                            <div className='follower-username-profile' onClick={()=>handleRedirectProfile(follower._id)}>
                                <p>{follower.firstName} {follower.lastName}</p>
                            </div>
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