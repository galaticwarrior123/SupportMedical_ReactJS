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
}