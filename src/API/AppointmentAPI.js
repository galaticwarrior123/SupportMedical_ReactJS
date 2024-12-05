import { axiosPrivate } from "./AxiosClient";

export class AppointmentAPI {
    static async getAppointmentList(filter) {
        const url = '/appointment';
        return axiosPrivate.get(url, { params: {
            ...filter
        } });
    }

    static async getAllAppointments() {
        return axiosPrivate.get('/appointment/all');
    }
}