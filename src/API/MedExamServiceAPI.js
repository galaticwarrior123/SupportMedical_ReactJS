import { axiosPrivate } from "./AxiosClient";



export class MedExamServiceAPI {
    
    static async getMedExamServices() {
        const url = "/med-exam-service/all";
        return axiosPrivate.get(url);
    }

    static async createMedExamService(medExamService) {
        const url = "/med-exam-service/create";
        return axiosPrivate.post(url, medExamService);
    }

    static async updateMedExamService(id, medExamService) {
        const url = `/med-exam-service/update/` + id;
        return axiosPrivate.put(url, medExamService);
    }

    static async deleteMedExamService(id) {
        const url = `/med-exam-service/delete/${id}`;
        return axiosPrivate.delete(url);
    }
}
