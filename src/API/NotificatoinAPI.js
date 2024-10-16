import { axiosPrivate } from "./AxiosClient";

export class NoticationAPI {
    static async getNotifications() {
        return axiosPrivate.get("/notification");
    }
}