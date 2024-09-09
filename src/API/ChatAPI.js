import { axiosPrivate } from "./AxiosClient";

export class ChatAPI {
    static async getMessages(chatId) {
        return axiosPrivate.get(`/chat/${chatId}/messages`)
    }

    static async getPrivateChat(userId) {
        const url = `/chat/private/${userId}`;
        return axiosPrivate.get(url);
    }

    static async getChatById(chatId) {
        return axiosPrivate.get(`/chat/${chatId}`);
    }

    static async getChats() {
        return axiosPrivate.get('/chat');
    }
}

export const MessageType = {
    TEXT: 'text',
    IMAGE: 'image',
    APPOINTMENT: 'appointment',
    FILE: 'file',
    CALL: 'call',
}