import "./RejectedPost.css";
import PostAPI from "../../../../API/PostAPI";
import { useState } from "react";
import { toast } from "react-toastify";


const RejectedPost = ({handleCloseFormRejectedPost , postId}) => {
    const [reason, setReason] = useState('');
    const id = postId;
    const user = JSON.parse(localStorage.getItem("user"));
    
    const handleUpdatePost = async () => {
        if(user.doctorInfo.isPermission === false){
            toast.error('Bạn không có quyền thực hiện chức năng này');
            return;
        }
        if (reason === '') {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
        }
        try {
            const data = {
                status: "REJECTED",
                reasonRejected: reason
            }
            await PostAPI.updateStatusPost(id, data);
            handleCloseFormRejectedPost();
            toast.success('Từ chối bài viết thành công');
        } catch (error) {
            toast.error('Lỗi khi từ chối bài viết');
        }
    }
    return (
        <div className="rejected-post-container" onClick={handleCloseFormRejectedPost}>
            <div className="rejected-post" onClick={(e) => e.stopPropagation()}>
                <h2>Lý do từ chối</h2>
                <textarea name="reason" id="reason" placeholder="Nhập lý do từ chối" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                <button onClick={handleUpdatePost}>Gửi</button>
            </div>
        </div>
    );
};

export default RejectedPost;