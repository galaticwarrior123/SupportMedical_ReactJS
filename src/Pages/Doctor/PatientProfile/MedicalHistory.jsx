import { faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MedExamHistoryAPI } from '../../../API/MedExamHistoryAPI';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';

const MedicalHistory = () => {
    const { user } = useAuth();
    const { patientProfile } = useSelector((state) => state.doctorPatientProfile);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            if (!patientProfile) return;
            const response = await MedExamHistoryAPI.getMedExamHistoryByPatientId(patientProfile._id);
            console.log(response);
            const formattedHistory = response.data.map((record) => ({
                date: format(new Date(record.createdAt), "dd 'thg' MM',' yyyy"),
                ...record
            }));
            setMedicalHistory(formattedHistory);
        };
        fetchMedicalHistory();
    }, [patientProfile]);

    const toggleExpand = (index) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(index);
        }
    };

    return (
        <div className="patient-profile-card patient-profile-medical-history">
            <h2>Lịch sử khám bệnh</h2>
            {medicalHistory.map((record, index) => (
                <div className="record" key={index}>
                    <div className="record-header" onClick={() => toggleExpand(index)}>
                        <span className="record-header-date">{record.date}</span>
                        <span className="record-header-icon">
                            {expandedIndex === index ?
                                <FontAwesomeIcon icon={faChevronDown} />
                                : <FontAwesomeIcon icon={faChevronLeft} />}
                        </span>
                    </div>
                    {expandedIndex === index && (
                        <div className="record-details">
                            <div className="record-details-item">
                                <strong>Bác sĩ khám: </strong>
                                {
                                    record.doctor._id === user._id
                                        ? "bạn"
                                        : <Link to={`/forum/profile/${record.doctor._id}`}>{record.doctor.firstName} {record.doctor.lastName}</Link>
                                }
                            </div>
                            <div className="record-details-item">
                                <strong>Triệu chứng:</strong> {record.symptoms}
                            </div>
                            <div className="record-details-item">
                                <strong>Kết quả khám:</strong> {record.result}
                            </div>
                            <div className="record-details-item">
                                <strong>Kê đơn:</strong> {record.prescription}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MedicalHistory;