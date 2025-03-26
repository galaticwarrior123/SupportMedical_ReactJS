import axiosClient, { axiosPrivate } from "./AxiosClient";


export class RecordPatientAPI {

    static async getRecordPatientList(userId) {
        const url = '/record-patient/by-user/' + userId;
        return axiosClient.get(url);
    }


    static async createRecordPatient(data) {
        const url = '/record-patient/create';
        return axiosPrivate.post(url, data);
    }

    static async updateRecordPatient(id, data) {
        const url = '/record-patient/update/' + id;
        return axiosPrivate.put(url, data);
    }

    static async deleteRecordPatient(id) {
        const url = '/record-patient/delete/' + id;
        return axiosPrivate.delete(url);
    }

    static async searchRecordPatient(q) {
        const url = `/record-patient/search?q=${q}`;
        return axiosClient.get(url);
    }
}