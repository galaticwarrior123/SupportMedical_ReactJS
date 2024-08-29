import './HeaderProfile.css'

const HeaderProfile = ({ user }) => {
    return (
        <div className="profile-header-container">
            <div className="profile-header-banner-profile">
                <img src="./images/pictureDoctor.jpg" alt="Banner" />
            </div>
            <div className="profile-header-info-profile">
                <div className="profile-avatar-profile">
                    <img src="./images/Avatar.png" alt="Avatar" />
                </div>
                <div className="profile-header-text">
                    <h2 className="profile-username">Username</h2>
                    <p className="profile-followers">100 người theo dõi · 100 đang theo dõi</p>
                </div>
                <div className="profile-header-actions" style={{ marginLeft: 'auto' }}>
                    <button className="profile-message-button">Nhắn tin</button>
                    <button className="profile-follow-button">Theo dõi</button>
                </div>
            </div>
        </div>


    );
}

export default HeaderProfile;