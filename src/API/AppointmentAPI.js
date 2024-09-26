import { axiosPrivate } from "./AxiosClient";

export class AppointmentAPI {
    static async getAppointmentList(filter) {
        const url = '/appointment';
        console.log(filter);
        return axiosPrivate.get(url, { params: {
            ...filter
        } });
    }
}