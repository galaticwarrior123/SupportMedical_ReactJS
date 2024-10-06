import React from 'react';
import './ApptItem.css';

const ApptItem = ({ appt, onClick }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const other = (appt.sender._id === user._id ? appt.recipient : appt.sender);

    return (
        <div onClick={onClick} className="appointment-card">
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