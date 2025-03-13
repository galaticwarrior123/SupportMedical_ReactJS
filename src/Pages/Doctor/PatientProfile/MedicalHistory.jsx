import { faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const daysOfWeek = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];

const MedicalHistory = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const medicalRecords = [
        {
            date: '26 thg 11, 2024',
            details: 'Triệu chứng: nhứt đầu nhẹ, hoa mắt\nKết luận: cảm cúm\nKê đơn: paracetamol - 2 lần một ngày\nNgười khám: Bác sĩ Phúc',
        },
        {
            date: '23 thg 8, 2024',
            details: '', // Thêm chi tiết nếu có
        },
        {
            date: '8 thg 8, 2024',
            details: '', // Thêm chi tiết nếu có
        },
    ];

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
            {medicalRecords.map((record, index) => (
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
                            {record.details.split('\n').map((line, lineIndex) => (
                                <p key={lineIndex}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MedicalHistory;