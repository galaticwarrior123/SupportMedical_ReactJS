import './ItemPostUserHome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
const ItemPostUserHome = () => {
    return (
        <div class="center-user-home-post">
            <div class="center-user-home-post-header">
                <div class="center-user-home-post-avatar">
                    <img src="https://via.placeholder.com/50" alt="avatar" />
                </div>
                <div className="center-user-home-post-user-info">
                    <div class="center-user-home-post-user-info-top">
                        <span>Username</span>
                        <span class="center-user-home-post-badge">
                            <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Bác sĩ</span>
                    </div>
                    <div class="center-user-home-post-date">
                        <span>1 giờ trước</span>
                    </div>
                </div>

            </div>
            <div class="center-user-home-post-title">Title</div>
            <div class="center-user-home-post-categories">
                <span class="center-user-home-post-category cate1">Cate 1</span>
                <span class="center-user-home-post-category cate2">Cate 2</span>
            </div>
            <div class="center-user-home-post-image">
                <img src="https://via.placeholder.com/200" alt="post" />
            </div>
            <div class="center-user-home-post-footer">
                Like - comment - share dưới đây
            </div>
        </div>
    )
}

export default ItemPostUserHome;