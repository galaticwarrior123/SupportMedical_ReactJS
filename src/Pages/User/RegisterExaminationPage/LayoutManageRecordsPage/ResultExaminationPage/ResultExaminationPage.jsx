import LayoutManageRecordsPage from '../LayoutManageRecordsPage';
import './ResultExaminationPage.css';
import { MedExamHistoryAPI } from '../../../../../API/MedExamHistoryAPI';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faPhone,
    faVenusMars,
    faBirthdayCake,
    faHome,
    faCalendarAlt,
    faUserMd,
    faStethoscope,
    faNotesMedical,
    faPrescriptionBottleAlt,
    faPills,
    faBriefcase,
    faClose,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const ITEMS_PER_PAGE = 2;

const ResultExaminationPage = () => {
    const [listMedExamHistory, setListMedExamHistory] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [medItemExamHistory, setMedItemExamHistory] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [listDrug, setListDrug] = useState([]);

    useEffect(() => {
        const fetchMedExamHistory = async () => {
            try {
                const response = await MedExamHistoryAPI.getMedExamHistoryByUser();
                setListDrug(response.data.drugAssign);
                setListMedExamHistory(response.data);
            } catch (error) {
                console.error("Error fetching medical examination history:", error);
            }
        };

        fetchMedExamHistory();
    }, []);

    const handleOpenModal = (medItemExamHistory) => {
        setIsOpenModal(true);
        setMedItemExamHistory(medItemExamHistory);
    };

    const totalPages = Math.ceil(listMedExamHistory.length / ITEMS_PER_PAGE);
    const currentItems = listMedExamHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <LayoutManageRecordsPage>
            {isOpenModal && (
                <div className="modal-medical-history">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Thông tin kê thuốc</h2>
                            <button className="close-button" onClick={() => setIsOpenModal(false)}>
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-drug-list">
                                <div className="modal-drug-list">
                                    {medItemExamHistory.drugAssign && medItemExamHistory.drugAssign.length > 0 ? (
                                        <table className="drug-table">
                                            <thead>
                                                <tr>
                                                    <th>Tên thuốc</th>
                                                    <th>Liều lượng</th>
                                                    <th>Số lương</th>
                                                    <th>Nhà sản xuất</th>
                                                    <th>Chống chỉ định</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {medItemExamHistory.drugAssign.map((drug, index) => (
                                                    <tr key={index}>
                                                        <td>{drug.drug.name}</td>
                                                        <td>{drug.drug.dosage}</td>
                                                        <td>{drug.quantity} {'hộp'}</td>
                                                        <td>{drug.drug.brand}</td>
                                                        <td>{drug.drug.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="modal-drug-empty">Không có thông tin kê đơn thuốc.</p>
                                    )}

                                    <div className="modal-info-prescriber">
                                        <p><FontAwesomeIcon icon={faUserMd} /> <span className="label">Bác sĩ kê đơn:</span> {medItemExamHistory.doctor?.firstName} {medItemExamHistory.doctor?.lastName}</p>
                                        <p><FontAwesomeIcon icon={faCalendarAlt} /> <span className="label">Ngày kê đơn:</span> {medItemExamHistory.createdAt?.split('T')[0].split('-').reverse().join('/')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="modal-close-button" onClick={() => setIsOpenModal(false)}>Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <div className="result-examination-page">
                <h2 className="title-result-examination">Kết quả khám bệnh</h2>
                {listMedExamHistory.length === 0 ? (
                    <div className="content-result-examination">
                        <p className="content-result-examination-text">Không có kết quả khám bệnh nào.</p>
                    </div>
                ) : (
                    <>
                        <div className="med-history-list">
                            {currentItems.map((item, index) => (
                                <div className="med-history-item" key={index}>
                                    <div className="med-history-patient">
                                        <h3>Thông tin bệnh nhân</h3>
                                        <p><FontAwesomeIcon icon={faUser} /> <span className="label">Họ và tên:</span> {item.recordPatient.name}</p>
                                        <p><FontAwesomeIcon icon={faPhone} /> <span className="label">Số điện thoại:</span> {item.recordPatient.phoneNumber}</p>
                                        <p><FontAwesomeIcon icon={faVenusMars} /> <span className="label">Giới tính:</span> {item.recordPatient.gender === true ? "Nam" : "Nữ"}</p>
                                        <p><FontAwesomeIcon icon={faBriefcase} /> <span className="label">Nghề nghiệp:</span> {item.recordPatient.job || "Chưa cập nhật"}</p>
                                        <p><FontAwesomeIcon icon={faBirthdayCake} /> <span className="label">Ngày sinh:</span> {item.recordPatient.dob.split('-').reverse().join('/')}</p>
                                        <p><FontAwesomeIcon icon={faHome} /> <span className="label">Địa chỉ:</span> {item.recordPatient.address}, {item.recordPatient.ward}, {item.recordPatient.district}, {item.recordPatient.province}</p>
                                    </div>
                                    <div className="med-history-exam">
                                        <h3>Thông tin khám bệnh</h3>
                                        <p><FontAwesomeIcon icon={faCalendarAlt} /> <span className="label">Ngày khám:</span> {item.createdAt.split('T')[0].split('-').reverse().join('/')}</p>
                                        <p><FontAwesomeIcon icon={faUserMd} /> <span className="label">Bác sĩ đảm nhận:</span> {item.doctor.firstName} {item.doctor.lastName}</p>
                                        <p><FontAwesomeIcon icon={faStethoscope} /> <span className="label">Chuyên khoa:</span> {item.doctor.doctorInfo.specialities[0].name}</p>
                                        <p><FontAwesomeIcon icon={faNotesMedical} /> <span className="label">Triệu chứng:</span> {item.symptoms}</p>
                                        <p><FontAwesomeIcon icon={faPrescriptionBottleAlt} /> <span className="label">Kết luận:</span> {item.result}</p>
                                        <p><FontAwesomeIcon icon={faPills} /> <span className="label">Kê đơn thuốc:</span>
                                            <span className="med-history-prescription" onClick={() => handleOpenModal(item)}>
                                                Xem chi tiết
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination controls */}
                        <div className="pagination-controls">
                            <button onClick={goToPrevPage} disabled={currentPage === 1}>
                                <FontAwesomeIcon icon={faChevronLeft} /> Trước
                            </button>
                            <span>Trang {currentPage} / {totalPages}</span>
                            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                                Tiếp <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </LayoutManageRecordsPage>
    );
};

export default ResultExaminationPage;
