import axiosClient, { axiosPrivate } from "./AxiosClient";


export class PaymentAPI {
    static async createPaymentUrl(data) {
        const url = '/payment/create-payment-url';
        return axiosPrivate.post(url, data);
    }
}