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
        const url = '/post/search?postId=' + id;
        return axiosClient.get(url);
    }

    static async getPostByUserId(id) {
        const url = `/post/search?userId=${id}`;
        return axiosClient.get(url);
    }

    static async getByDate(month, year) {
        const url = `/post/getByMonthYear?month=${month}&year=${year}`;
        return axiosClient.get(url);
    }
    
    static async getByTag(){
        const url = '/post/getByTag';
        return axiosClient.get(url);
    }

    // static async likePost(id) {
    //     const url = `/post/like/${id}`;
    //     return axiosPrivate.put(url);
    // }

    // static async unlikePost(id) {
    //     const url = `/post/unlike/${id}`;
    //     return axiosPrivate.put(url);
    // }

    static async reactPost(id, data) {
        const url = `/post/reaction/${id}`;
        return axiosPrivate.put(url, data);
    }

    static async updatePost(id, data) {
        const url = `/post/${id}`;
        return axiosPrivate.put(url, data);
    }

    static async searchPost(filter) {
        const url = `/post/search`;
        return axiosClient.get(url, { params: {
            title: filter.searchQuery,
            content: filter.searchQuery,
            tagId: filter?.tagId,
        } });
    }

    static async deletePost(id) {
        const url = `/post/${id}`;
        return axiosPrivate.delete(url);
    }
}

export default PostAPI;