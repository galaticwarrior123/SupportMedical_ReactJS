import { axiosPrivate } from "./AxiosClient";


export class ShiftAssignmentAPI {
    
    static async getShiftAssignments(data) {
        return axiosPrivate.get("/shift-assignment/all", { params: data });
    }

    static async createShiftAssignment(shiftAssignment) {
        return axiosPrivate.post("/shift-assignment/create", shiftAssignment);
    }

    static async deleteShiftAssignment(shiftAssignment) {
        return axiosPrivate.delete("/shift-assignment/delete", { data: shiftAssignment });
    }

    static async getMyShifts(filter) {
        return axiosPrivate.get("/shift-assignment/my-shifts", { params: filter });
    }
}