import React from 'react';
import styles from './AppointmentListModal.module.scss';
import { useDispatch } from 'react-redux';
import { closeAppointmentListModal } from '../../../redux/slices/doctorScheduleSlice';
import AppointmentItem from '../Dashboard/AppointmentItem';

function AppointmentListModal() {
    const dispatch = useDispatch();
    const appointments = [
        { name: 'Nguyễn Văn A', time: '9:00', type: 'TƯ VẤN' },
        { name: 'Nguyễn Văn B', time: '9:00', type: 'TÁI KHÁM' },
        { name: 'Nguyễn Văn C', time: '10:00', type: 'ĐỊNH KỲ' },
      ];
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span className={styles.date}>21/4/2025</span>
                    <div className={styles.shift}>
                        <span className={styles.shiftLabel}>Ca:</span>
                        <select className={styles.shiftSelect}>
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                        </select>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.appointments}>
                        <h3 className={styles.title}>Cuộc hẹn trong ngày</h3>
                        {/* <div className={styles.appointment}>
                            <span className={styles.name}>Nguyễn Văn A</span>
                            <span className={styles.time}>9:00</span>
                            <span className={styles.type}>TƯ VẤN</span>
                        </div>
                        <div className={styles.appointment}>
                            <span className={styles.name}>Nguyễn Văn B</span>
                            <span className={styles.time}>9:00</span>
                            <span className={styles.type}>TÁI KHÁM</span>
                        </div>
                        <div className={styles.appointment}>
                            <span className={styles.name}>Nguyễn Văn C</span>
                            <span className={styles.time}>10:00</span>
                            <span className={styles.type}>ĐỊNH KỲ</span>
                        </div> */}
                        {appointments.map((appointment, index) => (
                            <AppointmentItem key={index} {...appointment} />
                        ))}
                    </div>

                    <div className={styles.patientInfo}>
                        <h3 className={styles.patientName}>Nguyễn Văn A</h3>
                        <p className={styles.patientDetails}>Nam - 30 tuổi</p>
                        <div className={styles.patientNotes}>
                            <p className={styles.notesLabel}>Ghi chú của bệnh nhân:</p>
                            <ul className={styles.notesList}>
                                <li>Triệu chứng ho, nghẹt mũi</li>
                            </ul>
                        </div>
                        <div className={styles.previousVisit}>
                            <p className={styles.visitLabel}>Lần khám trước: Với bác sĩ Phúc vào 20 thg 11, 2024</p>
                            <p className={styles.visitDetails}>Triệu chứng: nhứt đầu nhẹ, hoa mắt</p>
                            <p className={styles.visitDetails}>Kết luận: cảm cúm</p>
                            <p className={styles.visitDetails}>Kê đơn: paracetamol - 2 lần một ngày</p>
                        </div>
                    </div>
                </div>

                <button className={styles.closeButton} onClick={() => dispatch(closeAppointmentListModal())}>Đóng</button>
            </div>
        </div>
    );
}

export default AppointmentListModal;