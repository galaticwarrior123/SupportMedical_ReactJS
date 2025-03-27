import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { useEffect, useState } from 'react';
import './ShiftChange.css';
import { ShiftChangeAPI } from '../../../../API/ShiftChangeAPI';
import { ShiftAssignmentAPI } from '../../../../API/ShiftAssignmentAPI';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
const ShiftChange = () => {
    const [shiftRequests, setShiftRequests] = useState([]);
    const [reasonReject, setReasonReject] = useState('');
    const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);


    useEffect(() => {
        fetchShiftRequests();
    }, []);

    const fetchShiftRequests = async () => {
        try {
            const response = await ShiftChangeAPI.getShiftRequests();
            setShiftRequests(response.data);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách yêu cầu đổi ca');
        }
    };

    const handleShiftChange = async (request) => {
        const data = {
            shiftAssignmentId: request.shiftAssignment._id,
            newDoctorId: request.newDoctor._id,
            currentDoctorId: request.currentDoctor._id,
            date: request.date
        }

        ShiftAssignmentAPI.shiftAssignmentChange(data)
            .then(() => {
                toast.success('Chấp nhận yêu cầu thành công');
                fetchShiftRequests();
            })
            .catch(() => {
                toast.error('Lỗi khi chấp nhận yêu cầu');
            });
            


    }

    const handleOpenRejectModal = () => {
        setIsOpenRejectModal(true);
    };

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <AnimatePresence>
                    {isOpenRejectModal && (
                        <div className="reject-modal">
                            <motion.div className="reject-modal-content"
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
                                <h2>Lý do từ chối</h2>
                                <textarea
                                    placeholder='Nhập lý do từ chối'
                                    value={reasonReject}
                                    onChange={e => setReasonReject(e.target.value)}
                                ></textarea>
                                <div className="reject-modal-actions">
                                    <button
                                        className="btn-cancel-reject"
                                        onClick={() => setIsOpenRejectModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="btn-confirm-reject"
                                        onClick={() => setIsOpenRejectModal(false)}
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="shift-change-container">
                    <h2>Danh sách yêu cầu đổi ca</h2>
                    <table className="shift-change-table">
                        <thead>
                            <tr>
                                <th>Bác sĩ hiện tại</th>
                                <th>Bác sĩ mới</th>
                                <th>Chuyên khoa</th>
                                <th>Ngày</th>
                                <th>Ca làm việc</th> {/* Cột ca làm việc */}
                                <th>Lý do</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shiftRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="no-data">Không có yêu cầu đổi ca nào</td>
                                </tr>

                            ) : shiftRequests.map(request => (
                                <tr key={request._id}>
                                    <td>BS. {request.currentDoctor.firstName} {request.currentDoctor.lastName}</td>
                                    <td>BS. {request.newDoctor.firstName} {request.newDoctor.lastName}</td>
                                    <td>{request.newDoctor.doctorInfo.specialities[0]?.name || 'Không có chuyên khoa'}</td>
                                    <td>{new Date(request.date).toLocaleDateString('vi-VN')}</td>
                                    <td>{request.shiftAssignment.shift.name}</td>
                                    <td>{request.reason}</td>
                                    <td>
                                        {request.status === 'PENDING' ? (
                                            <>
                                                <button className="approve-btn" onClick={() => handleShiftChange(request)}>
                                                    Chấp nhận
                                                </button>
                                                <button className="reject-btn" onClick={() => handleOpenRejectModal(request._id)}>
                                                    Từ chối
                                                </button>
                                            </>
                                        ) : request.status === 'ACCEPTED' ? (
                                            <span className="status-accepted">✔️ Đã chấp nhận</span>
                                        ) : (
                                            <span className="status-rejected">❌ Đã từ chối</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
}

export default ShiftChange;
