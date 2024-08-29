import './PostsProfile.css';

const PostsProfile = ({ posts }) => {
    return (
        <div className="post-container-profile">
            <div className="post-header-profile">
                <img src="profile-picture.jpg" alt="Profile" className="profile-picture-profile" />
                <div className="post-info-profile">
                    <h4>Username <span className="badge-profile">Bác sĩ</span></h4>
                    <p>Date</p>
                </div>
            </div>
            <div className="post-body-profile">
                <h3>Title</h3>
                <div className="post-categories-profile">
                    <span className="category-profile">Cate 1</span>
                    <span className="category-profile">Cate 2</span>
                </div>
                <img src="post-image.jpg" alt="Post" className="post-image-profile" />
            </div>
            <div className="post-footer-profile">
                <p>Like - comment - share dưới đây</p>
            </div>
        </div>
    );
}

export default PostsProfile;