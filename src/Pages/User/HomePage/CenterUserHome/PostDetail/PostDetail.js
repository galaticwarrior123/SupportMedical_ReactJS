import './PostDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsUp, faComment, faPaperPlane, faArrowRight, faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';
import ItemPostUserHome from '../../../../../Components/ItemPostUserHome/ItemPostUserHome';
const PostDetail = ({ handleCloseFullScreen, itemPost }) => {
    
   const currentUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="post-detail" onClick={handleCloseFullScreen}>
            <div className="post-detail-container" onClick={(e) => e.stopPropagation()}>
                <div className="post-detail-nav">
                    <span>{itemPost.title}</span>
                    <button onClick={handleCloseFullScreen}>
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
                <div className="post-detail-body">
                    <ItemPostUserHome itemPost={itemPost} currentUser={currentUser} isPostDetail={true}  />
                </div>

            </div>
        </div>

    );
};

export default PostDetail;