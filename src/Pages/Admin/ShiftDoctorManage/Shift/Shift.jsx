import './Shift.css';
import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import ShiftAPI from '../../../../API/ShiftAPI';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoDialog from '../../../../Components/YesNoDialog/YesNoDialog';


const Shift = () => {
    const [shifts, setShifts] = useState([]);
    const [shiftName, setShiftName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        ShiftAPI.getAllShift()
            .then(res => {
                setShifts(res.data);
            })
            .catch(err => {
                toast.error("Lấy dữ liệu ca làm việc thất bại!");
            });
    }, []);


    const handleAddShift = () => {
        if (!shiftName || !startTime || !endTime) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        ShiftAPI.createShift({ name: shiftName, startTime: startTime, endTime: endTime })
            .then(res => {
                toast.success("Thêm ca làm việc thành công!");
                setShifts(prev => [
                    ...prev,
                    { id: prev.length + 1, name: shiftName, startTime: startTime, endTime: endTime }
                ]);

                setShiftName('');
                setStartTime('');
                setEndTime('');
            })
            .catch(err => {
                toast.error("Thêm ca làm việc thất bại!");
            }
            );


    }

    const [shiftNameUpdate, setShiftNameUpdate] = useState('');
    const [startTimeUpdate, setStartTimeUpdate] = useState('');
    const [endTimeUpdate, setEndTimeUpdate] = useState('');
    const [shiftIdUpdate, setShiftIdUpdate] = useState('');

    const handleEditShift = (shift) => {
        setIsEdit(true);
        setShiftNameUpdate(shift.name);
        setStartTimeUpdate(shift.startTime);
        setEndTimeUpdate(shift.endTime);
        setShiftIdUpdate(shift._id);
    }

    const handleUpdateShift = () => {
        if (!shiftNameUpdate || !startTimeUpdate || !endTimeUpdate) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        ShiftAPI.updateShift(shiftIdUpdate, { name: shiftNameUpdate, startTime: startTimeUpdate, endTime: endTimeUpdate })
            .then(res => {
                toast.success("Cập nhật ca làm việc thành công!");
                setShifts(prev => prev.map(shift => shift._id === shiftIdUpdate ? { ...shift, name: shiftNameUpdate, startTime: startTimeUpdate, endTime: endTimeUpdate } : shift));

                setIsEdit(false);
                setShiftNameUpdate('');
                setStartTimeUpdate('');
                setEndTimeUpdate('');
                setShiftIdUpdate('');
            })
            .catch(err => {
                toast.error("Cập nhật ca làm việc thất bại!");
            });

    }

    const handleDeleteShift = (id) => {
        ShiftAPI.deleteShift(id)
            .then(res => {
                toast.success("Xóa ca làm việc thành công!");
                setIsOpenDialog(false);
                setShifts(prev => prev.filter(shift => shift._id !== id));
            })
            .catch(err => {
                toast.error("Xóa ca làm việc thất bại!");
            });

    }
    const [idShiftDelete, setIdShiftDelete] = useState('');

    const handleOpenDialogDelete = (id) => {
        setIsOpenDialog(true);
        setIdShiftDelete(id);

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
                    onConfirm={() => handleDeleteShift(idShiftDelete)}
                    onCancel={() => setIsOpenDialog(false)}
                    key={"delete-shift"}
                />
                <AnimatePresence>
                    {isEdit &&
                        <div className="edit-shift">
                            <motion.div className="edit-shift-content"
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
                                <div className="edit-shift-header">
                                    <h1>Sửa ca làm việc</h1>
                                    <button className="btn-exit-edit" onClick={() => setIsEdit(false)}>
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </div>


                                <div className="input-group-edit-shift">
                                    <label htmlFor="shift-name">Nhập tên ca làm việc</label>
                                    <input type="text" id="shift-name" placeholder=" " value={shiftNameUpdate} onChange={(e) => setShiftNameUpdate(e.target.value)} />

                                    <label htmlFor="start-time">Giờ bắt đầu</label>
                                    <input type="time" id="start-time" placeholder=" " value={startTimeUpdate} onChange={(e) => setStartTimeUpdate(e.target.value)} />

                                    <label htmlFor="end-time">Giờ kết thúc</label>
                                    <input type="time" id="end-time" placeholder=" " value={endTimeUpdate} onChange={(e) => setEndTimeUpdate(e.target.value)} />


                                    <button className="save-shift" onClick={handleUpdateShift}>
                                        <FontAwesomeIcon icon={faPlus} /> Lưu
                                    </button>

                                </div>
                            </motion.div>
                        </div>
                    }
                </AnimatePresence>

                <div className="shift">
                    <div className="shift-header">
                        <div className="input-group-shift">
                            <input type="text" id="shift-name" placeholder=" " value={shiftName} onChange={(e) => setShiftName(e.target.value)} />
                            <label htmlFor="shift-name">Nhập tên làm việc</label>
                        </div>

                        <div className="input-group-shift">
                            <input type="time" id="start-time" placeholder=" " value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            <label htmlFor="start-time">Giờ bắt đầu</label>
                        </div>

                        <div className="input-group-shift">
                            <input type="time" id="end-time" placeholder=" " value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            <label htmlFor="end-time">Giờ kết thúc</label>
                        </div>

                        <button className="add-shift" onClick={handleAddShift}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm ca làm việc
                        </button>
                    </div>

                    <div className="search-bar">
                        <input type="text" placeholder="Tìm kiếm" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                        {/* <button className="search-btn">
                            <FontAwesomeIcon icon={faSearch} />
                        </button> */}
                    </div>

                    <table className="shift-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên ca trực</th>
                                <th>Giờ hoạt động</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.filter(shift => shift.name.toLowerCase().includes(searchName.toLowerCase()))
                                .map((shift, index) => (
                                    <tr key={shift._id}>
                                        <td>{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                        <td>{shift.name}</td>
                                        <td>{shift.startTime} - {shift.endTime}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEditShift(shift)}>
                                                <FontAwesomeIcon icon={faPen} /> Sửa
                                            </button>
                                            <button className="delete-btn" onClick={() => handleOpenDialogDelete(shift._id)}>
                                                <FontAwesomeIcon icon={faTrash} /> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default Shift;
