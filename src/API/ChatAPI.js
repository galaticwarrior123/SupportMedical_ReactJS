import { axiosPrivate } from "./AxiosClient";

export class ChatAPI {
    static async getMessages(chatId) {
        return axiosPrivate.get(`/chat/${chatId}/messages`)
    }
}