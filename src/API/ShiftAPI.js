import { axiosPrivate } from "./AxiosClient";




class ShiftAPI {

    static async getAllShift() {
        const url = '/shift/all';
        return axiosPrivate.get(url);
    }

    static async createShift(data) {
        const url = '/shift/create';
        return axiosPrivate.post(url, data);
    }

    static async updateShift(id, data) {
        const url = '/shift/update/' + id;
        return axiosPrivate.put(url, data);
    }

    static async deleteShift(id) {
        const url = '/shift/delete/' + id;
        return axiosPrivate.delete(url);
    }
}


export default ShiftAPI;