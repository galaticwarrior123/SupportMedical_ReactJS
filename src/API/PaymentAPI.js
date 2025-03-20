import axiosClient from "./AxiosClient";


export class PaymentAPI {
    static async createPaymentUrl(data) {
        const url = '/payment/create-payment-url';
        return axiosClient.post(url, data);
    }
}