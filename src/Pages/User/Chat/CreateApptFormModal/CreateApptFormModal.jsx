import { useState } from "react";
import "./CreateApptFormModal.css";
import { formatDate } from "date-fns";
import { AppointmentStatus } from "../../../../API/ChatAPI";

export const ApptFormModalView = {
    CREATE: 'create',
    EDIT: 'edit',
    VIEW: 'view',
}

const CreateApptFormModal = ({ show, handleClose, handleSendAppt, appt, view = ApptFormModalView.CREATE }) => {
    const [date, setDate] = useState(formatDate(appt?.date || new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [title, setTitle] = useState(appt?.title || "");
    const [content, setContent] = useState(appt?.content || "");

    return (
        show &&
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">
                    {view === ApptFormModalView.CREATE && "Tạo cuộc hẹn"}
                    {view === ApptFormModalView.EDIT && "Chỉnh sửa cuộc hẹn"}
                    {view === ApptFormModalView.VIEW && "Chi tiết cuộc hẹn"}
                </h2>
                <div className="modal-body">
                    <div>
                        <label>Tiêu đề cuộc hẹn</label>
                        <input value={title}
                            readOnly={view === ApptFormModalView.VIEW}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text" placeholder="Nhập tiêu đề" />
                    </div>

                    <div>
                        <label>Nội dung</label>
                        <textarea value={content}
                            readOnly={view === ApptFormModalView.VIEW}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập nội dung mới" rows="6"></textarea>
                    </div>

                    <div>
                        <label>Thời gian</label>
                        <input value={date}
                            readOnly={view === ApptFormModalView.VIEW || view === ApptFormModalView.EDIT}
                            onChange={(e) => setDate(e.target.value)}
                            type="datetime-local" placeholder="Chọn thời gian" />
                    </div>
                </div>
                <div className="modal-footer">

                    <button className="cancel-btn" onClick={() => {
                        handleClose();
                    }} >Đóng</button>

                    
                    {view === ApptFormModalView.CREATE && <button onClick={() => handleSendAppt({
                        title,
                        content,
                        date,
                        apptStatus: AppointmentStatus.PENDING
                    })} className="confirm-btn">Tạo lịch hẹn</button>}
                </div>
            </div>
        </div>
    );
};

export default CreateApptFormModal;