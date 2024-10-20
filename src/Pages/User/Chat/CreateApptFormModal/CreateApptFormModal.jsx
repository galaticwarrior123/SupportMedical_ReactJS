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

    const INIT_ERROR = {
        title: "",
        content: "",
        date: ""
    };

    const [error, setError] = useState(INIT_ERROR);

    const handleCreateAppt = () => {
        const newError = { ...INIT_ERROR };

        const dateConverted = new Date(date);
        if (dateConverted < new Date()) {
            newError.date = "Thời gian không hợp lệ";
        }
        if (!title) {
            newError.title = "Tiêu đề không được để trống";
        }
        if (!content) {
            newError.content = "Nội dung không được để trống";
        }

        if (newError.title || newError.content || newError.date) {
            setError(newError);
            return;
        }

        handleSendAppt({ title, content, date, apptStatus: AppointmentStatus.PENDING });
        handleClose();
    }

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
                        {error.title && <span className="error">{error.title}</span>}
                    </div>

                    <div>
                        <label>Nội dung</label>
                        <textarea value={content}
                            readOnly={view === ApptFormModalView.VIEW}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập nội dung mới" rows="6"></textarea>
                        {error.content && <span className="error">{error.content}</span>}
                    </div>

                    <div>
                        <label>Thời gian</label>
                        <input value={date}
                            readOnly={view === ApptFormModalView.VIEW || view === ApptFormModalView.EDIT}
                            onChange={(e) => setDate(e.target.value)}
                            type="datetime-local" placeholder="Chọn thời gian" />
                        {error.date && <span className="error">{error.date}</span>}
                    </div>
                </div>
                <div className="modal-footer">

                    <button className="cancel-btn" onClick={() => {
                        handleClose();
                    }} >Đóng</button>

                    
                    {view === ApptFormModalView.CREATE && <button onClick={handleCreateAppt} className="confirm-btn">Tạo lịch hẹn</button>}
                </div>
            </div>
        </div>
    );
};

export default CreateApptFormModal;