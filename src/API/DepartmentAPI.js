import axiosClient, { axiosPrivate } from "./AxiosClient";

export class DepartmentAPI {
    
    static async getAll() {
        return axiosClient.get('/department/all');
    }
    static async createDepartment(department) {
        return axiosPrivate.post('/department/create', department);
    }

    static async updateDepartment(id,department) {
        return axiosPrivate.put('/department/update/'+id, department);
    }

    static async deleteDepartment(departmentId) {
        return axiosPrivate.delete(`/department/delete/${departmentId}`);
    }
}