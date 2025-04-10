import axiosClient, { axiosPrivate } from "./AxiosClient";



export class DrugAPI {
    static async getAll() {
        const url = `/drug/all`;
        return axiosClient.get(url);
    }

    static async create(data) {
        const url = `/drug/create`;
        return axiosPrivate.post(url, data);
    }

    static async update(id, data) {
        const url = `/drug/update/${id}`;
        return axiosPrivate.put(url, data);
    }

    static async delete(id) {
        const url = `/drug/delete/${id}`;
        return axiosPrivate.delete(url);
    }
}