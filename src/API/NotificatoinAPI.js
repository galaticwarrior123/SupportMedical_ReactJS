import { axiosPrivate } from "./AxiosClient";

export class NotificationAPI {
    static async getNotifications() {
        return axiosPrivate.get("/notification");
    }

    static async markAsRead(notificationIds) {
        return axiosPrivate.put("/notification/mark-as-read", { notificationIds });
    }
}