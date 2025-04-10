import axiosClient, { axiosPrivate } from "./AxiosClient";


export class TypeDrugAPI {
    static async getAll() {
        const url = `/type-drug/all`;
        return axiosClient.get(url);
    }

    static async create(data) {
        const url = `/type-drug/create`;
        return axiosPrivate.post(url, data);
    }

    static async update(id, data) {
        const url = `/type-drug/update/${id}`;
        return axiosPrivate.put(url, data);
    }

    static async delete(id) {
        const url = `/type-drug/delete/${id}`;
        return axiosPrivate.delete(url);
    }
}