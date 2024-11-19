import "./RejectedPost.css";
import PostAPI from "../../../../API/PostAPI";
import { useState } from "react";


const RejectedPost = ({handleCloseFormRejectedPost , postId}) => {
    const [reason, setReason] = useState('');
    const id = postId;
    
    const handleUpdatePost = async () => {
        try {
            console.log(reason);
            const data = {
                status: "REJECTED",
                reasonRejected: reason
            }
            await PostAPI.updatePost(id, data);
            handleCloseFormRejectedPost();
        } catch (error) {
            console.error(error);
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