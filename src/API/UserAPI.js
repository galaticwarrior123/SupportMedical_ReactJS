import axiosClient, { axiosPrivate } from "./AxiosClient";

export class UserAPI {
    static async findUserByEmail(email) {
        return axiosClient.get(`/user/find?email=${email}`);
    }

    static async searchUser(query) {
        return axiosClient.get(`/user/search?query=${query}`);
    }

    static async getUserById(userId) {
        
        return axiosClient.get(`/user/`, {
            params: {
                userId: userId
            }
        });
    }

    static async followUser(userId) {
        return axiosPrivate.put(`/user/follow/?userId=${userId}`); 
    }

    static async updateProfile(user) {
        return axiosPrivate.put('/user/update-profile', user,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async getAll () {
        return axiosClient.get('/user/all');
    }
}