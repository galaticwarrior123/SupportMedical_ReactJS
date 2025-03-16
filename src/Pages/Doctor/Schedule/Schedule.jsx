import { useState } from "react";
import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import './Schedule.css';
import { useDispatch, useSelector } from "react-redux";
import { openAppointmentListModal } from "../../../redux/slices/doctorScheduleSlice";
import AppointmentListModal from "./AppointmentListModal";

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

const Schedule = () => {
    const dispatch = useDispatch();
    const today = new Date();
    const { isAppointmentListModalOpen } = useSelector((state) => state.doctorSchedule);
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const daysInMonth = getDaysInMonth(year, month);

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

    const handleSelectDay = (day) => {
        if (day) {
            setSelectedDay(day);
            dispatch(openAppointmentListModal());
        }
    };

    return (
        <DoctorLayout>
            {isAppointmentListModalOpen && <AppointmentListModal />}
            <div className="doctor-schedule-container">
                <div className="day-selection">
                    <h3>Lịch làm việc</h3>
                    <div className="month-header">
                        <button className="nav-button" onClick={() => changeMonth(-1)}>⬅</button>
                        <span>{`THÁNG ${month + 1} - ${year}`}</span>
                        <button className="nav-button" onClick={() => changeMonth(1)}>➡</button>
                    </div>
                    <table  className="calendar">
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
                </div>
            </div>
        </DoctorLayout>
    );
}

export default Schedule;