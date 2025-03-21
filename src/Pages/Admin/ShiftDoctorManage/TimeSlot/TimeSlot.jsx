import React, { useEffect, useState } from 'react';
import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import './TimeSlot.css';
import { TimeSlotAPI } from '../../../../API/TimeSlotAPI';
import { toast } from 'react-toastify';

const TimeSlot = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');
    const [slotInterval, setSlotInterval] = useState(30); // Minutes per slot
    const [maxRegistrations, setMaxRegistrations] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    const intervalOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    useEffect(() => {
        TimeSlotAPI.getAllTimeSlots()
            .then(res => {
                setTimeSlots(res.data);
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi tải danh sách ca làm việc');
            });
    }, []);


    const generateTimeSlots = () => {
        const slots = [];
        const currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);
    
        while (currentDate <= endDateObj) {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            const currentSlotTime = new Date(currentDate);
            currentSlotTime.setHours(startHour, startMinute, 0, 0);
    
            const endSlotTime = new Date(currentDate);
            endSlotTime.setHours(endHour, endMinute, 0, 0);
    
            while (currentSlotTime <= endSlotTime) {
                const endTimeObj = new Date(currentSlotTime.getTime() + slotInterval * 60000); // Tính toán endTime
    
                const slot = {
                    id: Date.now() + Math.random(),
                    date: currentDate.toISOString().split('T')[0],
                    startTime: currentSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    endTime: endTimeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Định dạng 24h
                    maxRegistrations,
                };
                slots.push(slot);
                currentSlotTime.setMinutes(currentSlotTime.getMinutes() + slotInterval);
            }
    
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        const data = slots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            date: slot.date,
            maxRegistrations: slot.maxRegistrations
        }));
    
        TimeSlotAPI.createTimeSlot(data)
            .then(res => {
                setTimeSlots(res.data);
                setStartDate('');
                setEndDate('');
                setStartTime('08:00');
                setEndTime('17:00');
                setCurrentPage(1);
                toast.success('Tạo ca làm việc thành công');
            }).catch(err => {
                toast.error('Có lỗi xảy ra khi tạo ca làm việc');
            });
    };
    

    const handleDelete = (id) => {
        TimeSlotAPI.deleteTimeSlot(id)
            .then(res => {
                setTimeSlots(prevSlots => prevSlots.filter(slot => slot._id !== id));
                toast.success('Xóa ca làm việc thành công');
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi xóa ca làm việc');
            });
    };

    const handleUpdate = (id, newMaxRegistrations,slot) => {
        console.log(id, newMaxRegistrations,slot);

        TimeSlotAPI.updateTimeSlot(id, {
            startTime: slot.startTime,
            endTime: slot.endTime,
            date: slot.date,
            maxRegistrations: newMaxRegistrations
        })
            .then(res => {
                setTimeSlots(prevSlots => prevSlots.map(slot => {
                    if (slot._id === id) {
                        return { ...slot, maxRegistrations: newMaxRegistrations };
                    }
                    return slot;
                }));
                toast.success('Cập nhật số lượng đăng ký tối đa thành công');
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi cập nhật số lượng đăng ký tối đa');
            });

    };

    const filteredSlots = timeSlots.filter(slot =>
        (slot.date && slot.date.includes(searchQuery)) ||
        (slot.startTime && slot.startTime.includes(searchQuery)) ||
        (slot.endTime && slot.endTime.includes(searchQuery))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSlots.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="timeslot-container">
                    <div className="settings">
                        <label>Ngày bắt đầu: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
                        <label>Ngày kết thúc: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
                        <label>Thời gian bắt đầu: <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></label>
                        <label>Thời gian kết thúc: <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></label>
                        <label>Khoảng cách mỗi ca (phút):
                            <select value={slotInterval} onChange={e => setSlotInterval(Number(e.target.value))}>
                                {intervalOptions.map(interval => (
                                    <option key={interval} value={interval}>{interval}</option>
                                ))}
                            </select>
                        </label>
                        <label>Số lượng đăng ký tối đa: <input type="number" value={maxRegistrations} onChange={e => setMaxRegistrations(Number(e.target.value))} /></label>
                        <button onClick={generateTimeSlots}>Tạo tự động</button>
                    </div>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo ngày hoặc giờ..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="slot-list">
                        {currentItems.map(slot => (
                            <div key={slot._id} className="slot-item">
                                <span>{slot.date} - {slot.startTime} - {slot.endTime}</span>
                                <span>Số lượng đăng ký tối đa: {slot.maxRegistrations}</span>
                                <div className='slot-item-buttons'>
                                    <button onClick={() => handleDelete(slot._id)} className='btn-slot-delete'>Xóa</button>
                                    <button onClick={() => {
                                        const newMax = prompt('Nhập số lượng đăng ký tối đa mới:', slot.maxRegistrations);
                                        if (newMax) handleUpdate(slot._id, Number(newMax), slot);
                                    }} className='btn-slot-update'>Cập nhật</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="timeslot-container-pagination">
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Trang trước</button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Trang sau</button>
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default TimeSlot;

