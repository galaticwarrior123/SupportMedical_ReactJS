import { axiosPrivate } from "./AxiosClient";


export class ShiftAssignmentAPI {
    
    static async getShiftAssignments(data) {
        return axiosPrivate.get("/shift-assignment/all", { params: data });
    }

    static async createShiftAssignment(shiftAssignment) {
        return axiosPrivate.post("/shift-assignment/create", shiftAssignment);
    }
}