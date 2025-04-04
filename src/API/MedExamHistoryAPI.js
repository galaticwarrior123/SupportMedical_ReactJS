import axiosClient, { axiosPrivate } from "./AxiosClient";

export class MedExamHistoryAPI {
    static async getMedExamHistoryByPatientId(id) {
        const url = `/med-exam-history/get-by-record-patient/${id}`;
        return axiosClient.get(url);
    }

    static async getMedExamHistoryByUser() {
        const url = "/med-exam-history/get-by-user";
        return axiosPrivate.get(url);
    }

    static async createMedExamHistory(medExamHistory) {
        const url = "/med-exam-history/create";
        return axiosPrivate.post(url, medExamHistory);
    }
}