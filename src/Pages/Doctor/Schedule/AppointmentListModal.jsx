import React, { useEffect, useState } from 'react';
import styles from './AppointmentListModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { closeAppointmentListModal, setSelectedPatient } from '../../../redux/slices/doctorScheduleSlice';
import AppointmentItem from '../Dashboard/AppointmentItem';
import { ResultRegistrationAPI } from '../../../API/ResultRegistrationAPI';
import { ResultRegistrationStatus } from '../../../Common/Constants';

function AppointmentListModal() {
    const dispatch = useDispatch();
    const selectedDate = useSelector((state) => state.doctorSchedule.selectedDate);
    const { selectedPatient } = useSelector((state) => state.doctorSchedule);

    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await ResultRegistrationAPI.doctorGetByFilter({
                    startDate: selectedDate,
                    endDate: selectedDate,
                    status: ResultRegistrationStatus.PENDING,
                });
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, [selectedDate]);
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span className={styles.date}>{selectedDate}</span>
                    <div className={styles.shift}>
                        <span className={styles.shiftLabel}>Ca:</span>
                        <select className={styles.shiftSelect}>
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                        </select>
                    </div>
                </div>

                {<div className={styles.content}>
                    {
                        appointments.length > 0 ? (
                            <>
                                <div className={styles.appointments}>
                                    <h3 className={styles.title}>Cuộc hẹn trong ngày</h3>
                                    {appointments.map((appointment, index) => (
                                        <AppointmentItem
                                            isSelected={selectedPatient?._id === appointment._id}
                                            onClick={() => {
                                                dispatch(setSelectedPatient(appointment));
                                            }} key={index} item={appointment} />
                                    ))}
                                </div>
                                {selectedPatient &&
                                    <div className={styles.patientInfo}>
                                        <h3 className={styles.patientName}>{selectedPatient?.recordPatient.name}</h3>
                                        <p className={styles.patientDetails}>{selectedPatient?.recordPatient.gender ? 'Nam' : 'Nữ'} - {selectedPatient?.recordPatient.province}</p>
                                        <p className={styles.patientDetails}>{selectedPatient?.recordPatient.dob}</p>
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
                                }
                            </>
                        ) : (
                            <div className={styles.noAppointments}>
                                <p>Không có cuộc hẹn nào trong ngày.</p>
                            </div>
                        )
                    }

                </div>
                }
                <button className={styles.closeButton} onClick={() => dispatch(closeAppointmentListModal())}>Đóng</button>
            </div>
        </div>
    );
}

export default AppointmentListModal;