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
    const [idReject, setIdReject] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Số lượng item trên mỗi trang

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
        try {
            const data = {
                shiftAssignmentId: request.shiftAssignment._id,
                newDoctorId: request.newDoctor._id,
                currentDoctorId: request.currentDoctor._id,
                date: request.date
            };

            // Gọi API đổi ca
            await ShiftAssignmentAPI.shiftAssignmentChange(data);

            // Cập nhật trạng thái yêu cầu đổi ca
            await ShiftChangeAPI.updateShiftRequest(request._id, { status: 'ACCEPTED' });

            toast.success('Chấp nhận yêu cầu thành công');
            fetchShiftRequests();
        } catch (error) {
            toast.error('Lỗi khi chấp nhận yêu cầu');
        }
    };



    const handleConfirmReject = async (shiftRequestId) => {
        if (!reasonReject) {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
        }

        const data = {
            reason: reasonReject,
            status: 'REJECTED'
        };

        ShiftChangeAPI.rejectShiftRequest(shiftRequestId, data)
            .then(() => {
                toast.success('Từ chối yêu cầu thành công');
                setIsOpenRejectModal(false);
                fetchShiftRequests();
            })
            .catch(() => {
                toast.error('Lỗi khi từ chối yêu cầu');
            });
    };


    const handleOpenRejectModal = (id) => {
        setIsOpenRejectModal(true);
        setIdReject(id);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset về trang 1 khi thay đổi số item/trang
    };

    const paginatedData = shiftRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(shiftRequests.length / itemsPerPage);

    const generatePaginationButtons = () => {
        let buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return buttons;
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
                                        onClick={() => handleConfirmReject(idReject)}
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
                                <th>Ca làm việc</th>
                                <th>Lý do</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="no-data">Không có yêu cầu đổi ca nào</td>
                                </tr>

                            ) : paginatedData.map(request => (
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

                    <div className="pagination">
                        <span>Hiển thị</span>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span>
                            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, shiftRequests.length)} của {totalPages}
                        </span>
                        <div className="page-controls">
                            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                                &lt;
                            </button>
                            {generatePaginationButtons()}
                            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
}

export default ShiftChange;
