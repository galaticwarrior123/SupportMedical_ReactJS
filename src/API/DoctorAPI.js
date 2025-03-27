import axiosClient, { axiosPrivate } from "./AxiosClient";



export class DoctorAPI {
    static async getDoctors() {
        return axiosClient.get(`/doctor/all`);
    }

    static async createDoctor(doctor) {
        return axiosPrivate.post(`/doctor/create`, doctor,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async getAlldoctor() {
        return axiosClient.get(`/doctor/all`);
    }


    static async getAllDoctorHaveShift() {
        return axiosClient.get(`/doctor/all/shift`);
    }

    static async getDoctorsHaveShiftFilter(filter) {
        const url = `/doctor/all/filterShift`;
        return axiosClient.get(url, { params: filter });
    }

    static async permissionDoctor(doctorInfo) {
        return axiosPrivate.put(`/doctor/update/permissionDoctor`, doctorInfo);
    }
}