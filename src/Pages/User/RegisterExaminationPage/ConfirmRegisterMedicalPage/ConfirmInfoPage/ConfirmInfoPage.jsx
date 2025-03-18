import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './ConfirmInfoPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft, faUser, faCalendarAlt, faEnvelope, faIdCard, faVenusMars, faMapMarkerAlt, faExclamationCircle, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';


const ConfirmInfoPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const doctorSelected = location.state;

    const handleNavigate = (path) => {
        navigate(path, { state: doctorSelected });
    }

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="confirm-info-container">
                <div className="section-confirm-info">
                    <h2>Xác nhận thông tin khám</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Chuyên khoa</th>
                                <th>Dịch vụ</th>
                                <th>Bác sĩ</th>
                                <th>Thời gian khám</th>
                                <th>Tiền khám</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>{doctorSelected.doctor.doctorInfo.specialities[0].name}</td>
                                <td>Tư vấn ngay online 01 lần</td>
                                <td>{doctorSelected.doctor.firstName} {doctorSelected.doctor.lastName}</td>
                                <td><strong>{doctorSelected.timeSlot}</strong> ngày {doctorSelected.date}</td>
                                <td>150.000 đ</td>
                                <td><button className="delete-button-confirm"><FontAwesomeIcon icon={faTrash} /></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="section-confirm-info">
                    <h2>Thông tin bệnh nhân</h2>
                    <div className="patient-info">
                        <div className='patient-info-para'><FontAwesomeIcon icon={faUser} /> Họ và tên: <strong>NGUYỄN TRỌNG PHÚC</strong></div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faCalendarAlt} /> Ngày sinh: 01/01/2003</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faPhone} /> Số điện thoại: 0823452559</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faVenusMars} /> Giới tính: Nam</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faIdCard} /> Nghề nghiệp: Sinh viên</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ: Phường Linh Trung Thành phố Thủ Đức Thành phố Hồ Chí Minh</div>
                    </div>
                    {/* <div className="warning-message">
                        <FontAwesomeIcon icon={faExclamationCircle} /> Trong thời gian quy định, nếu quý khách hủy phiếu khám sẽ được hoàn lại tiền khám và các dịch vụ đã đặt (không bao gồm phí tiện ích).
                    </div> */}
                </div>

                <div className="buttons">
                    <button className="back-button-confirm" onClick={() => handleNavigate('/select-day')}><FontAwesomeIcon icon={faArrowLeft} /> Quay lại</button>
                    <button className="confirm-button" onClick={() => handleNavigate('/select-payment')}>Xác nhận</button>
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
};

export default ConfirmInfoPage;
