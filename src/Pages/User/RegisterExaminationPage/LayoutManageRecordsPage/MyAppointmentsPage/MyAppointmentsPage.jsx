import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutManageRecordsPage from '../LayoutManageRecordsPage';
import './MyAppointmentsPage.css';
import {
    faUser, faStethoscope, faUserMd, faClock, faPhone, faBriefcase,
    faCalendar, faVenusMars, faLocationDot, faClose
} from '@fortawesome/free-solid-svg-icons';
import { ResultRegistrationAPI } from '../../../../../API/ResultRegistrationAPI';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultRegistrationStatus } from '../../../../../Common/Constants';

const MyAppointmentsPage = () => {
    const [listAppointments, setListAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        ResultRegistrationAPI.getAllResultRegistration(user._id)
            .then((response) => {
                const filteredAppointments = response.data.filter(item => item.status !== ResultRegistrationStatus.CANCELLED);
                setListAppointments(filteredAppointments);
                setCurrentPage(1); // Reset to the first page after fetching
            })
            .catch(() => {
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
        const data = {
            status:  ResultRegistrationStatus.CANCELLED
        };

        ResultRegistrationAPI.updateResultRegistration(id, data)
            .then(() => {
                toast.success("Hủy lịch hẹn thành công");
                setListAppointments((prev) => prev.filter((item) => item._id !== id));
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra khi hủy lịch hẹn");
            });
    };

    // Pagination logic
    const totalPages = Math.ceil(listAppointments.length / itemsPerPage);
    const currentItems = listAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <LayoutManageRecordsPage>
            <>
                <h2 className="title-manage-records">Lịch hẹn của tôi</h2>

                {currentItems.length > 0 ? currentItems.map((appointment, index) => (
                    <div className="appointment-card-result" key={index}>
                        <div className="appointment-card-up">
                            <p><FontAwesomeIcon icon={faUser} className="icon" /> <strong>Họ và tên:</strong> <span>{appointment.recordPatient.name}</span></p>
                            <p><FontAwesomeIcon icon={faStethoscope} className="icon" /> <strong>Chuyên khoa khám:</strong> <span>{appointment.doctor.doctorInfo.specialities[0].name}</span></p>
                            <p><FontAwesomeIcon icon={faUserMd} className="icon" /> <strong>Bác sĩ phụ trách:</strong> <span>BS. {appointment.doctor.firstName} {appointment.doctor.lastName}</span></p>
                            <p><FontAwesomeIcon icon={faClock} className="icon" /> <strong>Thời gian:</strong> <span>{appointment.shiftSegment.startTime}-{appointment.shiftSegment.endTime} ngày {appointment.shiftSegment.date.split('-').reverse().join('/')}</span></p>
                        </div>
                        <div className="appointment-card-buttons">
                            {appointment.status === "pending" ? (
                                <button className="btn-cancel-appointment" onClick={() => handleCancleAppointment(appointment._id)}>Hủy lịch hẹn</button>
                            ) : (
                                <button className="btn-done-appointment" disabled>Đã khám</button>
                            )}
                            <button className="btn-details-appointment" onClick={() => handleViewDetails(appointment)}>Xem chi tiết</button>
                        </div>
                    </div>
                )) : <p>Chưa có lịch hẹn nào</p>}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Trang trước
                        </button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                )}

                {/* Modal details */}
                <AnimatePresence>
                    {selectedAppointment && (
                        <div className="modal-overlay-appointment">
                            <motion.div className="modal-appointment-content" onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.3, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.3, opacity: 0 }}
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
                                        <p><strong>Dịch vụ:</strong> {selectedAppointment.medExamService.name}</p>
                                        <p><strong>Bác sĩ:</strong> BS. {selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}</p>
                                        <p><strong>Thời gian khám:</strong> {selectedAppointment.shiftSegment.startTime}-{selectedAppointment.shiftSegment.endTime} ngày {selectedAppointment.shiftSegment.date.split('-').reverse().join('/')}</p>
                                        <p><strong>Tiền khám:</strong> {selectedAppointment.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</p>
                                        <p><strong>Ghi chú khám:</strong> {selectedAppointment.description || "Không có"}</p>
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
