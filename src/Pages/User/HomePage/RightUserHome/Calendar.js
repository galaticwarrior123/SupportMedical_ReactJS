import { useState } from 'react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderDaysOfWeek = () => {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days.map((day, index) => (
            <div key={index} className="day-name">
                {day}
            </div>
        ));
    };

    const renderDates = () => {
        const today = new Date();
        const dates = [];

        for (let i = 0; i < startDayOfWeek; i++) {
            dates.push(<div key={`empty-${i}`} className="empty-date" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            dates.push(
                <div key={i} className={`date ${isToday ? 'today' : ''}`}>
                    {i}
                </div>
            );
        }

        return dates;
    };
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    return (
        <>
            <div className="right-user-home-calendar-header">
                <button onClick={previousMonth}>&lt;</button>
                <h2>{capitalizeFirstLetter(currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }))}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            <div className="right-user-home-calendar-body">
                <div className="days-of-week">{renderDaysOfWeek()}</div>
                <div className="dates-grid">{renderDates()}</div>
            </div>
        </>
    )
};

export default Calendar;