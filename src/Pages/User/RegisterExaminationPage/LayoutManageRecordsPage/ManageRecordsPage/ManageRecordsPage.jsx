import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ManageRecordsPage.css';
import { faUser, faBirthdayCake, faPhone, faVenusMars, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import LayoutManageRecordsPage from '../LayoutManageRecordsPage';
import { useEffect, useState } from 'react';
import { RecordPatientAPI } from '../../../../../API/RecordPatientAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ManageRecordsPage = () => {
    const [visibleRecords, setVisibleRecords] = useState([]);
    const [listRecords, setListRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        RecordPatientAPI.getRecordPatientList(user._id)
            .then((response) => {
                setListRecords(response.data);
            })
            .catch(() => {
                toast.error("Lỗi khi lấy danh sách hồ sơ bệnh nhân");
            });
    }, [user._id]);

    useEffect(() => {
        if (listRecords.length > 0) {
            let tempList = [];
            listRecords.forEach((record, index) => {
                setTimeout(() => {
                    tempList.push(record);
                    if (index === listRecords.length - 1) {
                        setVisibleRecords(tempList);
                    }
                }, index * 50);
            });
        }
    }, [listRecords]);

    const handleEditRecord = (record) => {
        navigate('/create-patient-record', {
            state: {
                record: record,
                statusUpdate: true
            }
        });
    };

    const handleDeleteRecord = (recordId) => {
        RecordPatientAPI.deleteRecordPatient(recordId)
            .then(() => {
                toast.success("Xóa hồ sơ bệnh nhân thành công");
                const newList = visibleRecords.filter(record => record._id !== recordId);
                setVisibleRecords(newList);
                setListRecords(newList);
            })
            .catch(() => {
                toast.error("Lỗi khi xóa hồ sơ bệnh nhân");
            });
    };

    // Pagination
    const totalPages = Math.ceil(visibleRecords.length / itemsPerPage);
    const paginatedRecords = visibleRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <LayoutManageRecordsPage>
            <>
                <h2 className="title-manage-records">Danh sách hồ sơ bệnh nhân</h2>

                {paginatedRecords.length > 0 ? paginatedRecords.map((record) => (
                    <div className="record-card" key={record._id}>
                        <div className="record-card-up">
                            <p>
                                <FontAwesomeIcon icon={faUser} className="fa-icon" />
                                <strong>Họ và tên:</strong> <strong style={{ color: "#2697EC" }}>{record.name}</strong>
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faBirthdayCake} className="fa-icon" />
                                <strong>Ngày sinh:</strong> {record.dob.split("-").reverse().join("/")}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faPhone} className="fa-icon" />
                                <strong>Số điện thoại:</strong> {record.phoneNumber}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faVenusMars} className="fa-icon" />
                                <strong>Giới tính:</strong> {record.gender == 1 ? "Nam" : "Nữ"}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faMapMarkedAlt} className="fa-icon" />
                                <strong>Địa chỉ:</strong> {record.address}, {record.ward}, {record.district}, {record.province}
                            </p>
                        </div>

                        <div className="action-buttons-manage-records">
                            <button className="edit-btn-manage-records" onClick={() => handleEditRecord(record)}>Sửa hồ sơ</button>
                            <button className="delete-btn-manage-records" onClick={() => handleDeleteRecord(record._id)}>Xóa hồ sơ</button>
                        </div>
                    </div>
                )) : <p style={{ color: "#2697EC" }}>Không có hồ sơ nào</p>}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Trang trước
                        </button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                )}
            </>
        </LayoutManageRecordsPage>
    );
};

export default ManageRecordsPage;
