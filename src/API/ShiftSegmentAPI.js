import { axiosPrivate } from "./AxiosClient";


export class ShiftSegmentAPI {

    static async getShiftSegments() {
        const url = '/shift-segment/all';
        return axiosPrivate.get(url);
    }

    static async getShiftSegmentsByDoctor(doctor, date) {
        const url = '/shift-segment/getShiftSegmentByDoctor';
        return axiosPrivate.get(url, { params: { doctor, date } });
    }

    static async createShiftSegment(data) {
        const url = '/shift-segment/createShiftSegment';
        return axiosPrivate.post(url, data);
    }

    static async updateMaxRegistrations(id, maxRegister) {
        const url = `/shift-segment/updateMaxRegistrations?id=${id}&maxRegister=${maxRegister}`;
        return axiosPrivate.put(url);
    }


    static async deleteShiftSegment(id) {
        const url = `/shift-segment/deleteShiftSegment/${id}`;
        return axiosPrivate.delete(url);
    }
}