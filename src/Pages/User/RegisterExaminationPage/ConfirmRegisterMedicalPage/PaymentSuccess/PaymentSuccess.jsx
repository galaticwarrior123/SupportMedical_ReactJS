import './PaymentSuccess.css';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import { ResultRegistrationAPI } from '../../../../../API/ResultRegistrationAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const recordPatient = JSON.parse(localStorage.getItem('recordPatient'));
    const navigate = useNavigate();

    if (!recordPatient) {
        window.location.href = '/';
    }

    ResultRegistrationAPI.createResultRegistration(recordPatient)
        .then((response) => {
            localStorage.removeItem('recordPatient');
        })
        .catch((error) => {
            toast.error('Có lỗi xảy ra khi tạo thông tin đăng ký khám');
        });



    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="layout-payment-success">
                <div className="payment-success-card">
                    <div className="success-icon">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
                        </svg>
                    </div>
                    <h2>Thanh toán thành công</h2>
                    <p>Bạn đã đăng ký khám thành công. Bạn có thể xem thông tin lịch khám của mình tại đây</p>
                    <div className="button-group">
                        <button className="myregistration-button" onClick={() => navigate('/my-appointments')}>Lịch khám của tôi</button>
                        <button className="mainPage-button" onClick={() => navigate('/')}>Trang chủ</button>
                    </div>
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
}


export default PaymentSuccess;