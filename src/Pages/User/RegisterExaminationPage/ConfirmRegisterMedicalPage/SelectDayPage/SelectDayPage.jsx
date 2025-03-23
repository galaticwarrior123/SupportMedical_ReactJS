import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import { useEffect, useState } from 'react';
import './SelectDayPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShiftAssignmentAPI } from '../../../../../API/ShiftAssignmentAPI';
import { TimeSlotAPI } from '../../../../../API/TimeSlotAPI';
import { toast } from 'react-toastify';
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
    const [workingDays, setWorkingDays] = useState([]);
    const daysInMonth = getDaysInMonth(year, month);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const doctorSelected = location.state;
    const [listTimeSlots, setListTimeSlots] = useState([]);


    useEffect(() => {
        ShiftAssignmentAPI.getShiftAssignments({
            doctorId: doctorSelected.doctor._id,
            startDate: `${year}-${(month + 1).toString().padStart(2, "0")}-1`,
            endDate: `${year}-${(month + 1).toString().padStart(2, "0")}-31`
        }).then((response) => {
            const workingDays = response.data.map((shiftItem) => ({
                date: new Date(shiftItem.date).getDate(),
                startTime: shiftItem.shift.startTime,
                endTime: shiftItem.shift.endTime,
            }));

            setWorkingDays(workingDays);


        }).catch((error) => {
            toast.error('Lỗi khi tải dữ liệu ca làm việc');
        })
    }, [doctorSelected.doctor._id, month, year]);

    const handleSelectDay = (day) => {
        if (!day) return;

        // Định dạng ngày dạng yyyy-mm-dd
        const date = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        TimeSlotAPI.getTimeSlotsByDate(date)
            .then(res => {
                const fetchedTimeSlots = res.data; // Lấy danh sách khung giờ từ API

                // Tìm `workingDay` tương ứng với ngày đã chọn
                const workingDay = workingDays.filter((item) => item.date === day);

                if (workingDay.length > 0) {
                    // Lọc khung giờ theo tất cả các khoảng thời gian làm việc của bác sĩ
                    const filteredTimeSlots = fetchedTimeSlots.filter((timeSlot) => {
                        const [slotStartTime, slotEndTime] = [timeSlot.startTime, timeSlot.endTime];
    
                        // Kiểm tra khung giờ có nằm trong bất kỳ khoảng thời gian làm việc nào không
                        return workingDay.some(shift =>
                            shift.startTime <= slotStartTime && shift.endTime >= slotEndTime
                        );
                    });
    
                    setListTimeSlots(filteredTimeSlots); // Cập nhật danh sách khung giờ đã lọc
                    setTimeSlots(filteredTimeSlots); // Hiển thị khung giờ đã lọc
                    setSelectedDay(day); // Cập nhật ngày được chọn
                    setSelectedTimeSlot(null); // Reset lựa chọn khung giờ
                } else {
                    toast.error('Không tìm thấy thông tin ca làm việc cho ngày đã chọn');
                }
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi tải danh sách khung giờ');
            });
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
        const state = {
            ...doctorSelected,
        };

        if (selectedDay) {
            state.date = `${year}-${(month + 1).toString().padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;
            state.timeSlot = selectedTimeSlot;
        }

        navigate(path, { state });
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
                                        className={
                                            workingDays.some((item) => item.date === day) ? (day === selectedDay ? 'selected' : 'available') : 'disabled'
                                        }
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
                                            {`${slot.startTime} - ${slot.endTime}`}
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
