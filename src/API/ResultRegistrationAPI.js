import { axiosPrivate } from "./AxiosClient";

export class ResultRegistrationAPI {

    static async getAllResultRegistration(id) {
        const url = `/result-registration/allByUser/${id}`;
        return axiosPrivate.get(url);
    }

    static async getResultRegistrationById(id) {
        const url = `/result-registration/detail/${id}`;
        return axiosPrivate.get(url);
    }

    static async createResultRegistration(data) {
        const url = '/result-registration/create';
        return axiosPrivate.post(url, data);
    }

    static async deleteResultRegistration(id) {
        const url = `/result-registration/delete/${id}`;
        return axiosPrivate.delete(url);
    }

    static async doctorGetByFilter(filter) {
        const url = '/result-registration/doctor/get-by-filter';
        return axiosPrivate.get(url, { params: filter });
    }
}