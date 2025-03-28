import DoctorLayout from '../../../Layouts/Doctor/DoctorLayout';
import { useEffect, useState } from 'react';
import './RequestShiftChange.css';
import { DoctorAPI } from '../../../API/DoctorAPI';
import { ShiftAssignmentAPI } from '../../../API/ShiftAssignmentAPI';
import { ShiftChangeAPI } from '../../../API/ShiftChangeAPI';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoDialog from '../../../Components/YesNoDialog/YesNoDialog';

const RequestShiftChange = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [department, setDepartment] = useState('');
    const [shift, setShift] = useState('');
    const [doctor, setDoctor] = useState('');
    const [reason, setReason] = useState('');
    const [requests, setRequests] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [listDoctor, setListDoctor] = useState([]);
    const [listShiftAssignment, setListShiftAssignment] = useState([]);

    const [updatedRequest, setUpdatedRequest] = useState({});
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [idShiftDelete, setIdShiftDelete] = useState('');

    
    useEffect(() => {
        fetchShiftRequests();
        fetchDoctorsByDepartment();
    }, []);

    const fetchShiftRequests = async () => {
        try {
            const response = await ShiftChangeAPI.getShiftRequestByUser(user._id);
            setRequests(response.data);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách yêu cầu chuyển ca');
        }
    };

    useEffect(() => {
        if (doctor) {
            fetchShiftAssignment(doctor);
        } else {
            setListShiftAssignment([]);
        }
    }, [doctor]);


    const fetchDoctorsByDepartment = async () => {
        try {
            const response = await DoctorAPI.getDoctorBySpecialty(user.doctorInfo.specialities[0]);
            const filterDoctors = response.data.filter(doctor => doctor._id !== user._id);
            setListDoctor(filterDoctors);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách bác sĩ');
        }
    };

    const fetchShiftAssignment = async (doctorId) => {
        try {
            const response = await ShiftAssignmentAPI.getShiftAssignmentsByDoctorExpect(doctorId);
            const sortedShiftAssignments = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setListShiftAssignment(sortedShiftAssignments);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách ca làm việc');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!doctor || !shift || !reason) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const data = {
            currentShiftAssignmentId: listShiftAssignment.find(shiftAssignment => shiftAssignment._id === shift)._id,
            newDoctorId: doctor,
            currentDoctorId: user._id,
            date: new Date().toISOString(),
            reason: reason
        };


        ShiftChangeAPI.createShiftRequest(data)
            .then(() => {
                toast.success('Yêu cầu chuyển ca đã được gửi');
                fetchShiftRequests();
                setDepartment('');
                setDoctor('');
                setShift('');
                setReason('');
            })
            .catch(() => {
                toast.error('Lỗi khi gửi yêu cầu chuyển ca');
            });




    };

    const handleDeleteRequest = (id) => {
        ShiftChangeAPI.deleteShiftRequest(id)
            .then(() => {
                toast.success('Xóa yêu cầu chuyển ca thành công');
                fetchShiftRequests();
            })
            .catch(() => {
                toast.error('Lỗi khi xóa yêu cầu chuyển ca');
            });
    };

    

    const handleOpenEditModal = (request) => {
        setIsEdit(true);
        setUpdatedRequest(request);
    }
    const handleOpenDeleteDialog = (id) => {
        setIsOpenDialog(true);
        setIdShiftDelete(id);
    }

    const handleUpdateRequest = (request) => {
        const data = {
            currentShiftAssignmentId: request.shiftAssignment._id,
            newDoctorId: request.newDoctor._id,
            currentDoctorId: user._id,
            date: request.date,
            reason: request.reason
        }
        ShiftChangeAPI.updateShiftRequest(request._id, data)
            .then(() => {
                toast.success('Cập nhật yêu cầu chuyển ca thành công');
                fetchShiftRequests();
                setIsEdit(false);
            })
            .catch(() => {
                toast.error('Lỗi khi cập nhật yêu cầu chuyển ca');
            });
    }

    return (
        <DoctorLayout>
            <YesNoDialog
                isOpen={isOpenDialog}
                title={"Xác nhận"}
                message={"Bạn có chắc chắn muốn xóa ca làm việc này không?"}
                yesText={"Có"}
                noText={"Không"}
                onConfirm={() => handleDeleteRequest(idShiftDelete)}
                onCancel={() => setIsOpenDialog(false)}
                key={"delete-shift"}
            />


            <AnimatePresence>
                {isEdit && (
                    <div className="edit-request-modal">
                        <motion.div className="edit-request-content-modal"
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
                            <div className='edit-request-header'>
                                <h2>Cập nhật yêu cầu chuyển ca</h2>
                                <button className="close-modal-btn" onClick={() => setIsEdit(false)}>✖</button>
                            </div>
                            <div className="edit-request-form-modal">
                                <textarea value={updatedRequest.reason} onChange={(e) => setUpdatedRequest({ ...updatedRequest, reason: e.target.value })} placeholder="Nhập lý do chuyển ca..."></textarea>
                                <button className="submit-btn" onClick={() => handleUpdateRequest(updatedRequest)}>Cập nhật</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="request-shift-layout">
                <div className="request-shift-container">
                    <h2>Yêu cầu Chuyển Ca</h2>
                    <form onSubmit={handleSubmit} className="request-shift-form">

                        <label>Bác sĩ:</label>
                        <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                            <option value="" disabled hidden>Chọn Bác sĩ</option>
                            {listDoctor.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>BS. {doctor.firstName} {doctor.lastName}</option>
                            ))}
                        </select>

                        <label>Ca làm việc:</label>
                        <select value={shift} onChange={(e) => setShift(e.target.value)}>
                            <option value="" disabled hidden>Chọn Ca làm việc</option>
                            {listShiftAssignment.map((shiftAssignment) => (
                                <option key={shiftAssignment._id} value={shiftAssignment._id}>{shiftAssignment.shift.name} ({shiftAssignment.shift.startTime}-{shiftAssignment.shift.endTime} ngày {new Date(shiftAssignment.date).toLocaleDateString('vi-VN')})</option>
                            ))}
                        </select>

                        <label>Lý do:</label>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Nhập lý do chuyển ca..."></textarea>

                        <button type="submit" className="submit-btn">Chuyển ca</button>
                    </form>
                </div>
            </div>

            <div className="shift-request-table">
                <h3>Danh sách yêu cầu chuyển ca</h3>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Bác sĩ thay thế</th>
                            <th>Ca trực</th>
                            <th>Lý do</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">Không có yêu cầu chuyển ca nào</td>
                            </tr>
                        ) : requests.map((request, index) => (
                            <tr key={request._id}>
                                <td>{index + 1}</td>
                                <td>BS. {request.newDoctor.firstName} {request.newDoctor.lastName}</td>
                                <td>{request.shiftAssignment.shift.name} ({request.shiftAssignment.shift.startTime}-{request.shiftAssignment.shift.endTime} ngày {new Date(request.shiftAssignment.date).toLocaleDateString('vi-VN')})</td>
                                <td>{request.reason}</td>
                                <td>{new Date(request.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td>{request.status === 'PENDING' ? 'Đang chờ' : request.status === 'APPROVED' ? 'Đã chấp nhận' : 'Đã từ chối'}</td>
                                <td>
                                    {request.status === 'PENDING' &&
                                        <>
                                            <button className="edit-request-btn" onClick={() => handleOpenEditModal(request)}>Cập nhật</button>
                                            <button className="delete-request-btn" onClick={() => handleOpenDeleteDialog(request._id)}>Hủy</button>
                                        </>

                                    }
                                    {/* <button className="delete-btn" onClick={() => handleDeleteRequest(request._id)}>Xóa</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DoctorLayout>
    );
};

export default RequestShiftChange;
