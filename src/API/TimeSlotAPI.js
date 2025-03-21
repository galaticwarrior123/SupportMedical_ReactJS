import axiosClient, { axiosPrivate } from "./AxiosClient";



export class TimeSlotAPI {

    static async getAllTimeSlots () {
        return axiosClient.get('/time-slot/all');
    }

    static async getTimeSlotsByDate (date) {
        return axiosClient.get(`/time-slot/date/${date}`);
    }

    static async createTimeSlot (data) {
        return axiosPrivate.post('/time-slot/create', data);
    }

    static async updateTimeSlot (id, data) {
        return axiosPrivate.put(`/time-slot/update/${id}`, data);
    }

    static async deleteTimeSlot (id) {
        return axiosPrivate.delete(`/time-slot/delete/${id}`);
    }
}