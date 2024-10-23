import './ShowMore.css';
import PostAPI from '../../API/PostAPI';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const ShowMore = ({ itemPost, onDelete }) => {
    const handleDeletePost = async (postId) => {
        try {
            await PostAPI.deletePost(postId);
            toast.success('Xóa bài viết thành công');
            onDelete(postId);
            
        } catch (error) {
            toast.error('Lỗi xóa bài viết');
        }
    }




    
    return (
        <div className="show-more">
            <div className="show-more-container">
                <div className="show-more-container-body">
                    {/* <div className="show-more-container-body-item">
                        <span>Chỉnh sửa bài viết</span>
                    </div> */}
                    <div className="show-more-container-body-item">
                        <button className='button-delete-post'
                                onClick={()=>handleDeletePost(itemPost._id)}>Xóa bài viết</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ShowMore;