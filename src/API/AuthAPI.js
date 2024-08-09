import axiosClient, {axiosPrivate} from "./AxiosClient";

class AuthAPI {
    static async login(data) {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    }

    static async register(data) {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    }

    static async confirmUser(data) {
        const url = '/auth/verify';
        return axiosClient.post(url, data);
    }

    static async forgotPassword(data) {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data);
    }
    
    static async getProfile() {
        const url = '/auth/profile';
        return axiosPrivate.get(url);
    }
}

export default AuthAPI;