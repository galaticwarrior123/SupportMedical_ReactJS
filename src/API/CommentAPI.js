import axiosClient, {axiosPrivate} from "./AxiosClient";

class CommentAPI {
    static async createComment(data) {
        const url = '/comment';
        return axiosPrivate.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async getCommentByPostId(postId) {
        const url = `/comment/post/${postId}`;
        return axiosClient.get(url);
    }

    static async likeComment(id) {
        const url = `/comment/like/${id}`;
        return axiosPrivate.put(url);
    }

    static async deleteComment(id) {
        const url = `/comment/${id}`;
        return axiosPrivate.delete(url);
    }
}

export default CommentAPI;