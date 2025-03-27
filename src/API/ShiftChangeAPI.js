import axiosClient,{axiosPrivate} from "./AxiosClient";


export class ShiftChangeAPI {

    static getShiftRequests = async () => {
        const url = '/shift-change/all';
        return axiosClient.get(url);
    }

}