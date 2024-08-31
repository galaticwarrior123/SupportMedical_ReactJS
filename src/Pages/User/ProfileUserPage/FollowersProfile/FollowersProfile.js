import './FollowersProfile.css';

const FollowersProfile = () => {
    return (
        <div className="followers-container-profile">
            <h3>Được theo dõi bởi</h3>
            <div className="followers-list-profile">
                <div className="follower-profile">
                    <img src="follower1.jpg" alt="Follower" className="follower-picture-profile" />
                    <p>Username</p>
                </div>
                <div className="follower-profile">
                    <img src="follower2.jpg" alt="Follower" className="follower-picture-profile" />
                    <p>Username</p>
                </div>
                <div className="follower-profile">
                    <img src="follower3.jpg" alt="Follower" className="follower-picture-profile" />
                    <p>Username</p>
                </div>
            </div>
            <a href="#" className="view-all-profile">Xem tất cả</a>
        </div>
    );;
}

export default FollowersProfile;