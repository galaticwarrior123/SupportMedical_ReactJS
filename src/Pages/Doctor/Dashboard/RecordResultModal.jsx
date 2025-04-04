import React, { useState } from 'react';
import styles from './RecordResultModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { closeRecordResultModal, fetchResultRegistrations } from '../../../redux/slices/doctorDashboardSlice';
import { MedExamHistoryAPI } from '../../../API/MedExamHistoryAPI';
import { toast } from 'react-toastify';
import { ResultRegistrationAPI } from '../../../API/ResultRegistrationAPI';
import { ResultRegistrationStatus } from '../../../Common/Constants';

const INIT_HISTORY = {
    recordPatient: '',
    symptoms: '',
    result: '',
    prescription: ''
}

function RecordResultModal() {
    const dispatch = useDispatch();
    const { selectedPatient } = useSelector((state) => state.doctorDashboard);

    const [history, setHistory] = useState(INIT_HISTORY);

    const onClose = () => {
        // Reset the history state
        setHistory(INIT_HISTORY);
        dispatch(closeRecordResultModal());
    }

    const onSave = async () => {
        // Save the history to the database
        history.recordPatient = selectedPatient.recordPatient._id;
        try {
            const [_, __] = await Promise.all([
                MedExamHistoryAPI.createMedExamHistory(history),
                ResultRegistrationAPI.updateResultRegistration(
                    selectedPatient._id,
                    {
                        status: ResultRegistrationStatus.COMPLETED
                    }
                )
            ]);
            // fetch the updated list of appointments
            dispatch(fetchResultRegistrations());
            toast('Ghi nhận kết quả khám thành công');
        }
        catch (error) {
            console.error('Error saving medical history:', error);
            toast.error('Ghi nhận kết quả khám thất bại');
            return;
        }
        
        // Close the modal
        onClose();
    }
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.modal__title}>Ghi nhận kết quả khám</h2>

                <div className={styles.modal__field}>
                    <label htmlFor="symptoms">Triệu chứng:</label>
                    <textarea 
                        value={history.symptoms}
                        onChange={(e) => setHistory({ ...history, symptoms: e.target.value })} 
                        id="symptoms" className={styles.modal__input} 
                    />
                </div>

                <div className={styles.modal__field}>
                    <label htmlFor="result">Kết luận:</label>
                    <textarea 
                        value={history.result}
                        onChange={(e) => setHistory({ ...history, result: e.target.value })}
                        id="result" className={styles.modal__input} />
                </div>

                <div className={styles.modal__field}>
                    <label htmlFor="prescription">Kê đơn:</label>
                    <textarea 
                        value={history.prescription}
                        onChange={(e) => setHistory({ ...history, prescription: e.target.value })}
                        id="prescription" className={styles.modal__input} />
                </div>

                <div className={styles.modal__buttons}>
                    <button className={`${styles.modal__button} ${styles.modal__button_cancel}`} onClick={onClose}>
                        Hủy
                    </button>
                    <button 
                        onClick={onSave}
                        disabled={!history.result || !history.symptoms || !history.prescription}
                        className={`${styles.modal__button} ${styles.modal__button_save}`}>Lưu</button>
                </div>
            </div>
        </div>
    );
}

export default RecordResultModal;