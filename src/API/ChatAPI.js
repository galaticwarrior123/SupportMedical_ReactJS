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

    static async getMessagesPagination(chatId, page, limit) {
        return axiosPrivate.get(`/chat/${chatId}/messages`, {
            params: { page, pageSize: limit }
        });
    }
}

export const AppointmentStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
}

export const AppointmentStatusText = {
    [AppointmentStatus.PENDING]: 'Đang chờ xác nhận',
    [AppointmentStatus.ACCEPTED]: 'Đã chấp nhận',
    [AppointmentStatus.REJECTED]: 'Đã từ chối',
    [AppointmentStatus.CANCELLED]: 'Đã hủy',
}

export const MessageType = {
    TEXT: 'text',
    IMAGE: 'image',
    APPOINTMENT: 'appointment',
    FILE: 'file',
    CALL: 'call',
}