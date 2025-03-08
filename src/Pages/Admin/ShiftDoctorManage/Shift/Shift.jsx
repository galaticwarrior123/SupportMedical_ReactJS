import './Shift.css';
import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faSearch, faClose } from '@fortawesome/free-solid-svg-icons';

const Shift = () => {
    const [shifts, setShifts] = useState([
        { id: 1, name: "Sáng", start: "6.am", end: "11.am" },
        { id: 2, name: "Chiều", start: "1.pm", end: "5.pm" }
    ]);

    const [shiftName, setShiftName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    const handleAddShift = () => {
        if (!shiftName || !startTime || !endTime) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        console.log(shiftName, startTime, endTime);

        setShifts(prev => [
            ...prev,
            { id: prev.length + 1, name: shiftName, start: startTime, end: endTime }
        ]);

        setShiftName('');
        setStartTime('');
        setEndTime('');
    }

    const handleDeleteShift = (id) => {
        const isDelete = window.confirm("Bạn có chắc chắn muốn xóa ca trực này?");
        if (isDelete) {
            setShifts(prev => prev.filter(shift => shift.id !== id));
        }
    }

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                {isEdit &&
                    <div className="edit-shift">
                        <div className="edit-shift-content">
                            <div className="edit-shift-header">
                                <h1>Sửa ca trực</h1>
                                <button className="btn-exit-edit" onClick={() => setIsEdit(false)}>
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>


                            <div className="input-group-edit-shift">
                                <label htmlFor="shift-name">Nhập tên ca trực</label>
                                <input type="text" id="shift-name" placeholder=" " value={shiftName} onChange={(e) => setShiftName(e.target.value)} />

                                <label htmlFor="start-time">Giờ bắt đầu</label>
                                <input type="time" id="start-time" placeholder=" " value={startTime} onChange={(e) => setStartTime(e.target.value)} />

                                <label htmlFor="end-time">Giờ kết thúc</label>
                                <input type="time" id="end-time" placeholder=" " value={endTime} onChange={(e) => setEndTime(e.target.value)} />


                                <button className="save-shift" onClick={handleAddShift}>
                                    <FontAwesomeIcon icon={faPlus} /> Lưu
                                </button>

                            </div>
                        </div>
                    </div>
                }


                <div className="shift">
                    <div className="shift-header">
                        <div className="input-group-shift">
                            <input type="text" id="shift-name" placeholder=" " value={shiftName} onChange={(e) => setShiftName(e.target.value)} />
                            <label htmlFor="shift-name">Nhập tên ca trực</label>
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
                            <FontAwesomeIcon icon={faPlus} /> Thêm ca trực
                        </button>
                    </div>

                    <div className="search-bar">
                        <input type="text" placeholder="Tìm kiếm" />
                        <button className="search-btn">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
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
                            {shifts.map((shift, index) => (
                                <tr key={shift.id}>
                                    <td>{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                    <td>{shift.name}</td>
                                    <td>{shift.start} - {shift.end}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => setIsEdit(true)}>
                                            <FontAwesomeIcon icon={faPen} /> Sửa
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteShift(shift.id)}>
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
