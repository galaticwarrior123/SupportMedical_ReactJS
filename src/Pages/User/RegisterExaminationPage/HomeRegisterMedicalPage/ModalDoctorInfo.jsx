import { useNavigate } from 'react-router-dom';
import './ModalDoctorInfo.css';

const ModalDoctorInfo = ({ doctor, onClose }) => {
    const navigate = useNavigate();


    return (
        <div className="modal-doctor-info">
            <div className="modal-content-doctor-info">
                {/* Header */}
                <div className="modal-header-doctor-info">
                    <h2>Thông tin bác sĩ</h2>
                    <button className="close-button-doctor-info" onClick={onClose}>×</button>
                </div>

                <div className='modal-divider-doctor-info-container'>

                    {/* Phần trên: Ảnh bên trái - Thông tin bên phải */}
                    <div className="modal-body-doctor-info">
                        <div className="doctor-top-info">
                            <div className="doctor-avatar-container">
                                <img src={doctor.avatar} alt="Doctor Avatar" className="doctor-avatar" />
                            </div>
                            <div className="doctor-info-container">
                                <h3>BS. {doctor.firstName} {doctor.lastName}</h3>
                                <p><strong>Chuyên khoa:</strong> {doctor.doctorInfo.specialities[0].name}</p>
                                <p><strong>Số điện thoại:</strong> {doctor.doctorInfo.phone}</p>
                                <p><strong>Chuyên trị:</strong> {doctor.doctorInfo.treatment ? doctor.doctorInfo.treatment : 'Chưa có thông tin'}</p>
                            </div>
                        </div>

                        {/* Phần dưới: Thông tin mô tả */}
                        <div className="doctor-description">
                            <h4>Giới thiệu</h4>
                            <pre>{doctor.doctorInfo.description ? doctor.doctorInfo.description : 'Chưa có thông tin'}</pre>
                        </div>
                    </div>

                    <div className="modal-footer-doctor-info">
                        <button className="btn-close-doctor-info" onClick={onClose}>Đóng</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ModalDoctorInfo;
