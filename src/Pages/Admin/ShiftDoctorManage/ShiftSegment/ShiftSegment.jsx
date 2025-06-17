import React, { useEffect, useState } from 'react';
import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import './ShiftSegment.css';
import { ShiftSegmentAPI } from '../../../../API/ShiftSegmentAPI';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoDialog from '../../../../Components/YesNoDialog/YesNoDialog';
import { useLoading } from '../../../../context/LoadingProvider';


const ShiftSegment = () => {
    const { setLoading } = useLoading();
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

    const [isEdit, setIsEdit] = useState(false);
    const [updatedShiftSegment, setUpdatedShiftSegment] = useState({});
    const [idShiftSegmentDelete, setIdShiftSegmentDelete] = useState('');
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    useEffect(() => {
        ShiftSegmentAPI.getShiftSegments()
            .then(res => {
                setTimeSlots(res.data);
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi tải danh sách ca làm việc');
            });
    }, []);


    const generateTimeSlots = () => {
        setLoading(true);

        if (!startDate || !endDate) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }


        // nếu ngày bắt đầu lớn hơn ngày kết thúc
        if (new Date(startDate) > new Date(endDate)) {
            toast.error('Ngày bắt đầu không thể lớn hơn ngày kết thúc');
            return;
        }


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

            while (currentSlotTime < endSlotTime) {
                let endTimeObj = new Date(currentSlotTime.getTime() + slotInterval * 60000);

                // Nếu endTimeObj vượt quá endSlotTime, thì giới hạn nó lại
                if (endTimeObj > endSlotTime) {
                    endTimeObj = new Date(endSlotTime);
                }

                const slot = {
                    id: Date.now() + Math.random(),
                    date: currentDate.toISOString().split('T')[0],
                    startTime: currentSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    endTime: endTimeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    maxRegistrations,
                };

                slots.push(slot);

                // Kiểm tra nếu endTimeObj đã đạt hoặc vượt quá endSlotTime thì dừng
                if (endTimeObj >= endSlotTime) break;

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

        ShiftSegmentAPI.createShiftSegment(data)
            .then(res => {
                setTimeSlots(prevSlots => [...prevSlots, ...res.data]);
                setStartDate('');
                setEndDate('');
                setStartTime('08:00');
                setEndTime('17:00');
                setCurrentPage(1);
                toast.success('Tạo ca làm việc thành công');
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi tạo ca làm việc');
            });
        setLoading(false);
    };


    const handleDelete = (id) => {
        ShiftSegmentAPI.deleteShiftSegment(id)
            .then(res => {
                setTimeSlots(prevSlots => prevSlots.filter(slot => slot._id !== id));
                setIsOpenDialog(false);
                toast.success('Xóa ca làm việc thành công');
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi xóa ca làm việc');
            });
    };

    const handleUpdate = (id, newMaxRegistrations) => {
        ShiftSegmentAPI.updateMaxRegistrations(id, newMaxRegistrations)
            .then(res => {
                setTimeSlots(prevSlots => prevSlots.map(slot => {
                    if (slot._id === id) {
                        return { ...slot, maxRegistrations: newMaxRegistrations };
                    }
                    return slot;
                }));
                setIsEdit(false);
                toast.success('Cập nhật số lượng đăng ký tối đa thành công');
            })
            .catch(err => {
                toast.error('Có lỗi xảy ra khi cập nhật số lượng đăng ký tối đa');
            });

    };

    const filteredSlots = timeSlots.filter(slot =>
        (slot.date && slot.date.includes(searchQuery)) ||
        (slot.startTime && slot.startTime.includes(searchQuery)) ||
        (slot.endTime && slot.endTime.includes(searchQuery)) ||
        (slot.shiftAssignment?.user?.firstName && slot.shiftAssignment?.user?.firstName.includes(searchQuery)) ||
        (slot.shiftAssignment?.user?.lastName && slot.shiftAssignment?.user?.lastName.includes(searchQuery)) ||
        (slot.shiftAssignment?.user?.doctorInfo?.specialities[0].name && slot.shiftAssignment?.user?.doctorInfo?.specialities[0].name.includes(searchQuery))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSlots.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);



    const handleEditShiftSegment = (shiftSegment) => {
        setIsEdit(true);
        setUpdatedShiftSegment(shiftSegment);
    }

    const handleOpenDialog = (id) => {
        setIsOpenDialog(true);
        setIdShiftSegmentDelete(id);
    }

    const handleClose = () => {
        setIsEdit(false);
    }
    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <YesNoDialog
                    isOpen={isOpenDialog}
                    title={"Xác nhận"}
                    message={"Bạn có chắc chắn muốn xóa ca làm việc này không?"}
                    yesText={"Có"}
                    noText={"Không"}
                    onConfirm={() => handleDelete(idShiftSegmentDelete)}
                    onCancel={() => setIsOpenDialog(false)}
                    key={"delete-shift"}
                />
                <AnimatePresence>
                    {isEdit && (
                        <div className="edit-shift-segment-container">
                            <motion.div className="edit-shift-segment-form"
                                initial={{
                                    scale: 0.3,
                                    opacity: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    x: "0",
                                    y: "0"
                                }}
                                exit={{
                                    scale: 0.3,
                                    opacity: 0
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="edit-shift-segment-header">
                                    <h3>Cập nhật số lượng</h3>
                                    <button className="close-edit-shift-segment-btn" onClick={handleClose}>
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </div>
                                <div className="edit-shift-segment-content">
                                    <div className="edit-shift-segment-content-info">

                                        <span><strong>Thời gian: </strong>{updatedShiftSegment.startTime} - {updatedShiftSegment.endTime} ngày {updatedShiftSegment.date.split('-').reverse().join('/')}</span>
                                        <span><strong>Bác sĩ: </strong>BS. {updatedShiftSegment.shiftAssignment?.user?.firstName} {updatedShiftSegment.shiftAssignment?.user?.lastName}</span>
                                        <span><strong>Chuyên khoa: </strong>{updatedShiftSegment.shiftAssignment?.user?.doctorInfo?.specialities[0].name}</span>
                                        <span><strong>Số lượng đăng ký hiện tại: </strong>{updatedShiftSegment.currentRegistrations}/{updatedShiftSegment.maxRegistrations}</span>

                                    </div>
                                    <div className="edit-shift-segment-content-form">
                                        <label>Số lượng đăng ký tối đa: <input type="number" value={updatedShiftSegment.maxRegistrations} onChange={e => setUpdatedShiftSegment({ ...updatedShiftSegment, maxRegistrations: Number(e.target.value) })} /></label>
                                        <button onClick={() => handleUpdate(updatedShiftSegment._id, updatedShiftSegment.maxRegistrations)}>Cập nhật</button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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
                            placeholder="Tìm kiếm theo ngày, giờ, tên bác sĩ,..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="slot-list">
                        {currentItems.map(slot => (
                            <div key={slot._id} className="slot-item">
                                <div className='slot-item-top'>
                                    <div className='slot-item-top-left'>
                                        <span><strong>Thời gian: </strong>{slot.startTime} - {slot.endTime} ngày {slot.date.split('-').reverse().join('/')}</span>
                                        <span><strong>Bác sĩ: </strong>BS. {slot.shiftAssignment?.user?.firstName} {slot.shiftAssignment?.user?.lastName}</span>
                                        <span><strong>Chuyên khoa: </strong>{slot.shiftAssignment?.user?.doctorInfo?.specialities[0].name}</span>
                                    </div>
                                    <div className='slot-item-top-right'>
                                        <span><strong>Số lượng đăng ký hiện tại: </strong>{slot.currentRegistrations}/{slot.maxRegistrations}</span>
                                    </div>
                                </div>
                                <div className='slot-item-buttons'>
                                    <button onClick={() => handleOpenDialog(slot._id)} className='btn-slot-delete'>Xóa</button>
                                    <button onClick={() => handleEditShiftSegment(slot)} className='btn-slot-update'>Cập nhật</button>
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

export default ShiftSegment;

