import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './DetailAppointmentPage.css';
import { ResultRegistrationAPI } from '../../../../../API/ResultRegistrationAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const DetailAppointmentPage = () => {
    const resultId = useParams().id;
    const [result, setResult] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        ResultRegistrationAPI.getResultRegistrationById(resultId).then((response) => {
            console.log(response.data);
            setResult(response.data);
        }).catch((error) => {
            toast.error('Có lỗi xảy ra khi tải thông tin kết quả khám bệnh');
        });
    }, [resultId]);


    const checkTypeService = (typeService) => {
        if (typeService === 'appointment') {
            return 'Khám bệnh';
        } else if (typeService === 'directExamination') {
            return 'Khám trực tiếp';
        }
        return 'Khám định kỳ';
    }



    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="layout-detail-my-appointment-page-container">
                <div className="detail-my-appointment-page-container">
                    <h2 className="detail-my-appointment-page-title">Thông tin chi tiết khám bệnh</h2>

                    <div className="detail-my-appointment-page-content">
                        {/* Thông tin lịch khám */}
                        <div className="detail-my-appointment-page-box">
                            <h3>Thông tin lịch khám</h3>
                            <p><strong>Chuyên khoa:</strong> {result.doctor?.doctorInfo?.specialities[0].name}</p>
                            <p><strong>Dịch vụ:</strong> {checkTypeService(result.typeService)}</p>
                            <p><strong>Bác sĩ:</strong>BS. {result.doctor?.firstName} {result.doctor?.lastName}</p>
                            <p><strong>Thời gian khám:</strong> {result.shiftSegment?.startTime} - {result.shiftSegment?.endTime} ngày {result.timeSlot?.date.split('-').reverse().join('-')}</p>
                            <p><strong>Tiền khám:</strong> {result.fee?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ</p>
                        </div>

                        {/* Thông tin bệnh nhân */}
                        <div className="detail-my-appointment-page-box">
                            <h3>Thông tin bệnh nhân</h3>
                            <p> <strong>Họ và tên:</strong> {result.recordPatient?.name}</p>
                            <p> <strong>Số điện thoại:</strong> {result.recordPatient?.phoneNumber}</p>
                            <p> <strong>Nghề nghiệp:</strong> {result.recordPatient?.job}</p>
                            <p> <strong>Ngày sinh:</strong> {result.recordPatient?.dob.split('-').reverse().join('-')}</p>
                            <p> <strong>Giới tính:</strong> {result.recordPatient?.gender === true ? 'Nam' : 'Nữ'}</p>
                            <p> <strong>Địa chỉ:</strong> {result.recordPatient?.address}, {result.recordPatient?.ward}, {result.recordPatient?.district}, {result.recordPatient?.province}</p>
                        </div>
                    </div>

                    <div className="detail-my-appointment-page-button">
                        <button className="btn-back" onClick={() => navigate('/notifications')}>Quay lại</button>
                    </div>
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );

}


export default DetailAppointmentPage;