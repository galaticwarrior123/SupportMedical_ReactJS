import { useLocation } from 'react-router-dom';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './ConfirmRegisterMedicalPage.css';



const ConfirmRegisterMedicalPage = ({children}) => {
    const location = useLocation();
    const doctorSelected = location.state;

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="confirm-service-container">
                {/* Thông tin lịch hẹn */}
                <div className="appointment-info">
                    <h3>Thông tin lịch hẹn</h3>
                    <p><strong>Chuyên khoa:</strong> {doctorSelected.doctor.doctorInfo.specialities[0].name}</p>
                    <p><strong>Bác sĩ:</strong> BS. {doctorSelected.doctor.firstName} {doctorSelected.doctor.lastName} </p>
                </div>

                {/* Bảng chọn dịch vụ */}
                <div className="confirm-content">
                    {children}
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    )
}

export default ConfirmRegisterMedicalPage;