import axiosClient,{axiosPrivate} from "./AxiosClient";

class PostAPI {
    static async createPost(data) {
        const url = '/post';
        return axiosPrivate.post(url,data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    }

    static async getAllPost() {
        const url = '/post/search';
        return axiosClient.get(url);
    }

    static async getPostById(id) {
        const url = `/post/search?postId=${id}`;
        return axiosClient.get(url);
    }

    static async getPostByUserId(id) {
        const url = `/post/search?userId=${id}`;
        return axiosClient.get(url);
    }
    

    static async likePost(id) {
        const url = `/post/like/${id}`;
        return axiosPrivate.put(url);
    }

    static async unlikePost(id) {
        const url = `/post/unlike/${id}`;
        return axiosPrivate.put(url);
    }

    static async deletePost(id) {
        const url = `/post/${id}`;
        return axiosPrivate.delete(url);
    }
}

export default PostAPI;