import { useCallback, useEffect, useState } from "react";
import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import './Schedule.css';
import { useDispatch, useSelector } from "react-redux";
import { openAppointmentListModal } from "../../../redux/slices/doctorScheduleSlice";
import AppointmentListModal from "./AppointmentListModal";
import { ShiftAssignmentAPI } from "../../../API/ShiftAssignmentAPI";
import { use } from "react";

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

    const [listShift, setListShift] = useState([]);

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
            const selectedDate = new Date(year, month, day + 1).toISOString().split('T')[0];
            dispatch(openAppointmentListModal(selectedDate));
        }
    };
    useEffect(() => {
        const getListShift = async () => {
            const response = await ShiftAssignmentAPI.getMyShifts({ month: month + 1, year });
            console.log(response);
            setListShift(response.data);
        }
        getListShift();
    }, [month, year]);

    const checkShift = useCallback((day, shift) => {
        return listShift.some(item => item.date.split('-')[2] == day && item.shift.name.toLowerCase().includes(shift));
    }, [listShift]);

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
                                            {day && 
                                                <div className="doctor-schedule-day">
                                                    {day} 
                                                    {checkShift(day, 'sáng') && <div className="doctor-schedule-shift day-shift"></div>}
                                                    {checkShift(day, 'chiều') && <div className="doctor-schedule-shift afternoon-shift"></div>}
                                                    {checkShift(day, 'tối') && <div className="doctor-schedule-shift night-shift"></div>}
                                                </div>
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="legends">
                        <div className="legend">
                            <div className="doctor-schedule-shift day-shift"></div>
                            <span>Ca sáng</span>
                        </div>
                        <div className="legend">
                            <div className="doctor-schedule-shift afternoon-shift"></div>
                            <span>Ca chiều</span>
                        </div>
                        <div className="legend">
                            <div className="doctor-schedule-shift night-shift"></div>
                            <span>Ca tối</span>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}

export default Schedule;