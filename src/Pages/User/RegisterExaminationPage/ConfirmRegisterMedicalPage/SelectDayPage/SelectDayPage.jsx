import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import { useState } from 'react';
import './SelectDayPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];

const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    let days = [];
    let week = new Array(7).fill(null);

    for (let day = 1; day <= lastDate; day++) {
        let dayIndex = (firstDay + day - 1) % 7;
        if (dayIndex === 0 && day !== 1) {
            days.push(week);
            week = new Array(7).fill(null);
        }
        week[dayIndex] = day;
    }
    days.push(week);
    return days;
};

const SelectDayPage = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const daysInMonth = getDaysInMonth(year, month);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const navigate = useNavigate();

    const timeSlots = [
        '08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00',
        '10:00 - 10:30', '10:30 - 11:00', '13:00 - 13:30', '13:30 - 14:00',
        '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00'
    ];

    const handleSelectDay = (day) => {
        if (day) {
            setSelectedDay(day);
            setSelectedTimeSlot(null);
        }
    };

    const handleSelectTimeSlot = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
    };

    const splitTimeSlots = (slots, itemsPerRow) => {
        const rows = [];
        for (let i = 0; i < slots.length; i += itemsPerRow) {
            rows.push(slots.slice(i, i + itemsPerRow));
        }
        return rows;
    };

    const changeMonth = (delta) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setMonth(newMonth);
        setYear(newYear);
        setSelectedDay(null); // Reset ngày đã chọn khi đổi tháng
    };


    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <ConfirmRegisterMedicalPage>
            <div className="day-selection">
                <h3>Vui lòng chọn ngày khám</h3>
                <div className="month-header">
                    <button className="nav-button" onClick={() => changeMonth(-1)}>⬅</button>
                    <span>{`THÁNG ${month + 1} - ${year}`}</span>
                    <button className="nav-button" onClick={() => changeMonth(1)}>➡</button>
                </div>
                <table className="calendar">
                    <thead>
                        <tr>
                            {daysOfWeek.map((day, index) => (
                                <th key={index} className={day === 'CN' ? 'sunday' : day === 'Bảy' ? 'saturday' : ''}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {daysInMonth.map((week, i) => (
                            <tr key={i}>
                                {week.map((day, j) => (
                                    <td
                                        key={j}
                                        className={day === selectedDay ? 'selected' : day ? 'available' : 'empty'}
                                        onClick={() => handleSelectDay(day)}
                                    >
                                        {day && <span>{day}</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedDay && (
                    <>
                        <div className="time-slot-selection">
                            <h4>Vui lòng chọn khung giờ</h4>
                            {splitTimeSlots(timeSlots, 5).map((row, rowIndex) => (
                                <div className="time-slots" key={rowIndex}>
                                    {row.map((slot, index) => (
                                        <button
                                            key={index}
                                            className={slot === selectedTimeSlot ? 'time-slot selected' : 'time-slot'}
                                            onClick={() => handleSelectTimeSlot(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>


                        <div className="button-container">
                            <button className="confirm-button" disabled={!selectedTimeSlot} onClick={() => handleNavigate('/confirm-info')}>
                                Xác nhận
                            </button>
                        </div>
                    </>



                )}


            </div>

            <button className="back-button" onClick={() => handleNavigate('/select-record')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Quay lại
            </button>
        </ConfirmRegisterMedicalPage>
    );
};

export default SelectDayPage;
