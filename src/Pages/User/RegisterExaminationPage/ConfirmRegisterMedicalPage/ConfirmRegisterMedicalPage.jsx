import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './ConfirmRegisterMedicalPage.css';



const ConfirmRegisterMedicalPage = ({children}) => {
    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="confirm-service-container">
                {/* Thông tin lịch hẹn */}
                <div className="appointment-info">
                    <h3>Thông tin lịch hẹn</h3>
                    <p><strong>Chuyên khoa:</strong> Da liễu</p>
                    <p><strong>Bác sĩ:</strong> CKI. Đoàn Thị Bích Vân</p>
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