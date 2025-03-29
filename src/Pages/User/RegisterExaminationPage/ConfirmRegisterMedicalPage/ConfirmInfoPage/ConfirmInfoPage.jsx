import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './ConfirmInfoPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft, faUser, faCalendarAlt, faEnvelope, faIdCard, faVenusMars, faMapMarkerAlt, faExclamationCircle, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';


const ConfirmInfoPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const doctorSelected = location.state;
    const [description, setDescription] = useState('');

    const handleNavigate = (path) => {
        const state = {
            ...doctorSelected,
            description: description,
        };

        navigate(path, { state: state });
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
                                <td>{doctorSelected.medExamService.name}</td>
                                <td>BS. {doctorSelected.doctor.firstName} {doctorSelected.doctor.lastName}</td>
                                <td><strong>{doctorSelected.shiftSegment.startTime}-{doctorSelected.shiftSegment.endTime}</strong> ngày {doctorSelected.date.split('-').reverse().join('/')}</td>
                                <td><strong>{doctorSelected.medExamService.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</strong></td>
                                <td><button className="delete-button-confirm"><FontAwesomeIcon icon={faTrash} /></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="section-confirm-info">
                    <h2>Thông tin bệnh nhân</h2>
                    <div className="patient-info">
                        <div className='patient-info-para'><FontAwesomeIcon icon={faUser} /> Họ và tên: <strong>{doctorSelected.record.name}</strong></div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faCalendarAlt} /> Ngày sinh: {doctorSelected.record.dob.split('-').reverse().join('/')}</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faPhone} /> Số điện thoại: {doctorSelected.record.phoneNumber}</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faVenusMars} /> Giới tính: {doctorSelected.record.gender == true ? "Nam" : "Nữ"}</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faIdCard} /> Nghề nghiệp: {doctorSelected.record.job}</div>
                        <div className='patient-info-para'><FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ: {doctorSelected.record.address}, {doctorSelected.record.ward}, {doctorSelected.record.district}, {doctorSelected.record.province}</div>
                    </div>
                    {/* <div className="warning-message">
                        <FontAwesomeIcon icon={faExclamationCircle} /> Trong thời gian quy định, nếu quý khách hủy phiếu khám sẽ được hoàn lại tiền khám và các dịch vụ đã đặt (không bao gồm phí tiện ích).
                    </div> */}
                </div>

                <div className="section-confirm-note">
                    <h2>Ghi chú khám (nếu có)</h2>
                    <div className='note-textarea-container'>
                        <textarea className='note-textarea' placeholder='Nhập ghi chú tại đây...' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                </div>

                <div className='section-confirm-description'>
                    <h2>Lưu ý</h2>
                    <div className='description-para'>Quý khách vui lòng đến đúng giờ khám đã đặt. Nếu không đến đúng giờ khám, quý khách sẽ không được khám và không được hoàn tiền.</div>
                    <div className='description-para'>Nếu quý khách có bất kỳ câu hỏi nào về lịch hẹn của mình, vui lòng liên hệ với chúng tôi qua số điện thoại <strong>1900 1234</strong></div>
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
