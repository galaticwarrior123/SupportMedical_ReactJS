import axiosClient,{axiosPrivate} from "./AxiosClient";


export class ShiftChangeAPI {

    static getShiftRequests = async () => {
        const url = '/shift-change/all';
        return axiosClient.get(url);
    }

    static getShiftRequestByUser = async (userId) => {
        const url = `/shift-change/all/doctor/${userId}`;
        return axiosClient.get(url);
    }

    static createShiftRequest = async (shiftRequest) => {
        const url = '/shift-change/createRequestShiftChange';
        return axiosPrivate.post(url, shiftRequest);
    }

    static updateShiftRequest = async (id, shiftRequest) => {
        const url = '/shift-change/updateRequestShiftChange/' + id;
        return axiosPrivate.put(url, shiftRequest);
    }

    static deleteShiftRequest = async (shiftRequestId) => {
        const url = `/shift-change/deleteRequestShiftChange/${shiftRequestId}`;
        return axiosPrivate.delete(url);
    }

}