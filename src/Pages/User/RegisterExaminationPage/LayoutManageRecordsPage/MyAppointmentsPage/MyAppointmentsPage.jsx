import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutManageRecordsPage from '../LayoutManageRecordsPage';
import './MyAppointmentsPage.css';
import { faUser, faStethoscope, faUserMd, faClock, faPhone, faBriefcase, faCalendar, faVenusMars, faLocationDot, faClose } from '@fortawesome/free-solid-svg-icons';
import { ResultRegistrationAPI } from '../../../../../API/ResultRegistrationAPI';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const MyAppointmentsPage = () => {
    const [listAppointments, setListAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        ResultRegistrationAPI.getAllResultRegistration(user._id)
            .then((response) => {
                console.log(response.data);
                setListAppointments(response.data);
            })
            .catch((error) => {
                toast.error("Lỗi khi lấy danh sách lịch hẹn");
            });
    }, [user._id]);

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleCloseModal = () => {
        setSelectedAppointment(null);
    };

    const handleCancleAppointment = (id) => {
        ResultRegistrationAPI.deleteResultRegistration(id)
            .then((response) => {
                toast.success("Hủy lịch hẹn thành công");
                setListAppointments(listAppointments.filter((appointment) => appointment._id !== id));
            })
            .catch((error) => {
                toast.error("Lỗi khi hủy lịch hẹn");
            });
    };

    return (
        <LayoutManageRecordsPage>
            <>
                <h2 className="title-manage-records">Lịch hẹn của tôi</h2>

                {listAppointments.length > 0 ? listAppointments.map((appointment, index) => {
                    return (
                        <div className="appointment-card-result" key={index}>
                            <div className="appointment-card-up">
                                <p><FontAwesomeIcon icon={faUser} className="icon" /> <strong>Họ và tên:</strong> <span>{appointment.recordPatient.name}</span></p>
                                <p><FontAwesomeIcon icon={faStethoscope} className="icon" /> <strong>Chuyên khoa khám:</strong> <span>{appointment.doctor.doctorInfo.specialities[0].name}</span></p>
                                <p><FontAwesomeIcon icon={faUserMd} className="icon" /> <strong>Bác sĩ phụ trách:</strong> <span>BS. {appointment.doctor.firstName} {appointment.doctor.lastName}</span></p>
                                <p><FontAwesomeIcon icon={faClock} className="icon" /> <strong>Thời gian:</strong> <span>{appointment.timeSlot.startTime}-{appointment.timeSlot.endTime} ngày {appointment.timeSlot.date.split('-').reverse().join('/')}</span></p>
                            </div>
                            <div className="appointment-card-buttons">
                                <button className="btn-cancel-appointment" onClick={() => handleCancleAppointment(appointment._id)}> Hủy lịch hẹn</button>
                                <button className="btn-details-appointment" onClick={() => handleViewDetails(appointment)}>Xem chi tiết</button>
                            </div>
                        </div>
                    );
                }) : <p>Chưa có lịch hẹn nào</p>}


                <AnimatePresence>
                    {selectedAppointment && (
                        <div className="modal-overlay-appointment" onClick={handleCloseModal}>
                            <motion.div className="modal-appointment-content" onClick={(e) => e.stopPropagation()}
                                initial={{
                                    scale: 0.3,
                                    opacity: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    x: "0",
                                    y: "0"
                                }}
                                exit={{
                                    scale: 0.3,
                                    opacity: 0
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                
                                
                                
                            >
                                <div className="modal-appointment-header">
                                    <h3>Thông tin chi tiết khám bệnh</h3>
                                    <button className="btn-close-modal" onClick={handleCloseModal}><FontAwesomeIcon icon={faClose} /></button>
                                </div>
                                <div className="modal-appointment-body">
                                    <div className="modal-appointment-info">
                                        <h4>Thông tin lịch khám</h4>
                                        <p><strong>Chuyên khoa:</strong> {selectedAppointment.doctor.doctorInfo.specialities[0].name}</p>
                                        <p><strong>Dịch vụ:</strong> Đặt lịch hẹn khám</p>
                                        <p><strong>Bác sĩ:</strong> BS. {selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}</p>
                                        <p><strong>Thời gian khám:</strong> {selectedAppointment.timeSlot.startTime}-{selectedAppointment.timeSlot.endTime} ngày {selectedAppointment.timeSlot.date.split('-').reverse().join('/')}</p>
                                        <p><strong>Tiền khám:</strong> {selectedAppointment.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</p>
                                    </div>
                                    <div className="modal-appointment-patient-info">
                                        <h4>Thông tin bệnh nhân</h4>
                                        <p><FontAwesomeIcon icon={faUser} /> Họ và tên: {selectedAppointment.recordPatient.name}</p>
                                        <p><FontAwesomeIcon icon={faPhone} /> Số điện thoại: {selectedAppointment.recordPatient.phoneNumber}</p>
                                        <p><FontAwesomeIcon icon={faBriefcase} /> Nghề nghiệp: {selectedAppointment.recordPatient.job}</p>
                                        <p><FontAwesomeIcon icon={faCalendar} /> Ngày sinh: {selectedAppointment.recordPatient.dob.split('-').reverse().join('/')}</p>
                                        <p><FontAwesomeIcon icon={faVenusMars} /> Giới tính: {selectedAppointment.recordPatient.gender === true ? "Nam" : "Nữ"}</p>
                                        <p><FontAwesomeIcon icon={faLocationDot} /> Địa chỉ: {selectedAppointment.recordPatient.address}, {selectedAppointment.recordPatient.district}, {selectedAppointment.recordPatient.province}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        </LayoutManageRecordsPage>
    );
}

export default MyAppointmentsPage;
