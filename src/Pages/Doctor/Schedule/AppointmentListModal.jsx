import React, { useEffect, useState } from 'react';
import styles from './AppointmentListModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { closeAppointmentListModal, setSelectedPatient } from '../../../redux/slices/doctorScheduleSlice';
import AppointmentItem from '../Dashboard/AppointmentItem';
import { ResultRegistrationAPI } from '../../../API/ResultRegistrationAPI';
import { ResultRegistrationStatus } from '../../../Common/Constants';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';

function AppointmentListModal() {
    const dispatch = useDispatch();
    const { user } = useAuth();
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
                console.log(selectedDate);
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
                    {/* <div className={styles.shift}>
                        <span className={styles.shiftLabel}>Ca:</span>
                        <select className={styles.shiftSelect}>
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                        </select>
                    </div> */}
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
                                                <li>{selectedPatient.description ?? "(trống)"}</li>
                                            </ul>
                                        </div>
                                        <div className={styles.previousVisit}>
                                            {
                                                selectedPatient?.latestVisit && (
                                                    <>
                                                        <p className={styles.visitLabel}>
                                                            Lần khám trước: Với {
                                                                selectedPatient?.latestVisit.doctor._id === user._id
                                                                    ? "bạn"
                                                                    : <Link to={`/forum/profile/${selectedPatient?.latestVisit.doctor._id}`}>Bác sĩ {selectedPatient?.latestVisit.doctor.lastName}</Link>
                                                            } vào {format(new Date(selectedPatient?.latestVisit.createdAt), "dd 'thg' MM',' yyyy")}
                                                        </p>
                                                        <p className={styles.visitDetails}>Triệu chứng: {selectedPatient?.latestVisit.symptoms}</p>
                                                        <p className={styles.visitDetails}>Kết luận: {selectedPatient?.latestVisit.result}</p>
                                                        <p className={styles.visitDetails}>Kê đơn:
                                                            <ul style={{ margin: 0 }}>
                                                                {selectedPatient?.latestVisit.drugAssign.length > 0 ? (
                                                                    selectedPatient?.latestVisit.drugAssign.map((drug, index) => (
                                                                        <li key={index}>
                                                                            {drug.quantity}x {drug.drug.name}
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <p>(trống)</p>
                                                                )}
                                                            </ul>
                                                        </p>
                                                    </>
                                                )
                                            }
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