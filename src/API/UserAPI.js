import axiosClient, { axiosPrivate } from "./AxiosClient";

export class UserAPI {
    static async findUserByEmail(email) {
        return axiosPrivate.get(`/user/find?email=${email}`);
    }

    static async searchUser(query) {
        return axiosPrivate.get(`/user/search?query=${query}`);
    }

    static async searchUserByFilter(filter) {
        return axiosPrivate.get('/user/search', {
            params: {
                query: filter.searchQuery,
                isDoctor: filter.isDoctor,
            }
        });
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