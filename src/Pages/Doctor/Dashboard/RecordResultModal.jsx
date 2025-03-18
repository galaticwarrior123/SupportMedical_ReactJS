import React from 'react';
import styles from './RecordResultModal.module.scss';
import { useDispatch } from 'react-redux';
import { closeRecordResultModal } from '../../../redux/slices/doctorDashboardSlice';

function RecordResultModal() {
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(closeRecordResultModal());
    }
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.modal__title}>Ghi nhận kết quả khám</h2>

                <div className={styles.modal__field}>
                    <label htmlFor="symptoms">Triệu chứng:</label>
                    <textarea id="symptoms" className={styles.modal__input} />
                </div>

                <div className={styles.modal__field}>
                    <label htmlFor="conclusion">Kết luận:</label>
                    <textarea id="conclusion" className={styles.modal__input} />
                </div>

                <div className={styles.modal__field}>
                    <label htmlFor="prescription">Kê đơn:</label>
                    <textarea id="prescription" className={styles.modal__input} />
                </div>

                <div className={styles.modal__buttons}>
                    <button className={`${styles.modal__button} ${styles.modal__button_cancel}`} onClick={onClose}>
                        Hủy
                    </button>
                    <button className={`${styles.modal__button} ${styles.modal__button_save}`}>Lưu</button>
                </div>
            </div>
        </div>
    );
}

export default RecordResultModal;