import React from 'react';
import './ApptItem.css';

const ApptItem = ({ appt, onClick, selected, other }) => {

    return (
        <div onClick={onClick} className={`appointment-card ${selected ? 'selected' : ''}`}>
            <div className="date-section">
                <div className="label">Ngày</div>
                <div className="day">
                    {new Date(appt.date).getDate()}

                    
                </div>
            </div>
            <div className="info-section">
                <div className="time">
                    {"Thời gian: " + new Date(appt.date).getHours()}:{new Date(appt.date).getMinutes()}
                </div>
                <div className="details">
                    {`Bạn có cuộc hẹn `}
                    <strong>{appt.title}</strong>
                    {` với ${other.firstName} ${other.lastName}`}
                </div>
            </div>
        </div>
    );
}

export default ApptItem;
