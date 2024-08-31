import axiosClient from "./AxiosClient";

export class UserAPI {
    static async findUserByEmail(email) {
        return axiosClient.get(`/user/find?email=${email}`);
    }
}