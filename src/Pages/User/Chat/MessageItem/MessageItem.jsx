import { useState } from 'react';
import { AppointmentStatus, AppointmentStatusText, MessageType } from '../../../../API/ChatAPI';
import { formatFullDatetime } from '../../../../Common/DatetimeUtils';
import './MessageItem.css';
import { format } from 'date-fns';
import CreateApptFormModal, { ApptFormModalView } from '../CreateApptFormModal/CreateApptFormModal';
import YesNoDialog from '../../../../Components/YesNoDialog/YesNoDialog';
import { useSocket } from '../../../../context/SocketProvider';

const MessageItem = ({ message, onAcceptApt }) => {
    const socket = useSocket();
    const [showDate, setShowDate] = useState(false);
    const [showApptFormModal, setShowApptFormModal] = useState(false);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const byUser = message.sender._id === user._id;

    return (
        <>
            <YesNoDialog
                isOpen={showConfirmCancelModal}
                onCancel={() => setShowConfirmCancelModal(false)}
                onConfirm={() => {
                    socket.emit('update-appt-message-status', {
                        messageId: message._id,
                        status: AppointmentStatus.CANCELLED,
                    });
                    setShowConfirmCancelModal(false);
                }}
                yesText='Đồng ý'
                noText='Hủy'
                title='Xác nhận hủy cuộc hẹn'
                message='Thao tác này không thể hoàn tác, bạn có chắc chắn muốn hủy cuộc hẹn này không?'
            />
            {message.type === MessageType.APPOINTMENT &&
                <CreateApptFormModal 
                    show={showApptFormModal}
                    handleClose={() => setShowApptFormModal(false)}
                    appt={message.content} 
                    view={ApptFormModalView.VIEW} />
            }
            <div className={'message-item' + (byUser ? ' message-item-right' : '')}>
                {
                    byUser ||
                    <div className="message-item-avatar">
                        <img src="https://via.placeholder.com/150" alt="avatar" />
                    </div>
                }
                <div onClick={
                    () => setShowDate(!showDate)
                } className="message-item-content">
                    {
                        message.type === MessageType.TEXT && (
                            <div className="message-item-content-text">
                                <pre>{message.content}</pre>
                            </div>
                        )
                    }
                    {
                        message.type === MessageType.IMAGE && (
                            <>
                                {message.content.length === 1 && (
                                    <div className="message-item-content-image">
                                        <img src={message.content[0]} alt="image-message" />
                                    </div>
                                )}
                                {message.content.length === 2 && (
                                    <div className="message-item-content-images">
                                        <div className="message-item-content-image half-width">
                                            <img src={message.content[0]} alt="image-message" />
                                        </div>
                                        <div className="message-item-content-image half-width">
                                            <img src={message.content[1]} alt="image-message" />
                                        </div>
                                    </div>
                                )}
                                {message.content.length === 3 && (
                                    <div className="message-item-content-images">
                                        <div className="message-item-content-image half-width">
                                            <img src={message.content[0]} alt="image-message" />
                                        </div>
                                        <div className="message-item-content-image half-width">
                                            <img src={message.content[1]} alt="image-message" />
                                        </div>
                                        <div className="message-item-content-image">
                                            <img src={message.content[2]} alt="image-message" />
                                        </div>
                                    </div>
                                )}
                                {message.content.length > 3 && (
                                    <div className="message-item-content-images">
                                        <div className="message-item-content-image half-width">
                                            <img src={message.content[0]} alt="image-message" />
                                        </div>
                                        <div className="message-item-content-image half-width">
                                            <img src={message.content[1]} alt="image-message" />
                                        </div>
                                        <div className="message-item-content-image">
                                            <img src={message.content[2]} alt="image-message" />
                                        </div>
                                        <div className="message-item-content-image">
                                            <span>+{message.content.length - 3} ảnh khác</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )
                    }
                    {
                        message.type === MessageType.APPOINTMENT && (
                            <div className="message-item-content-appointment">
                                <div className="message-item-content-appointment-title">
                                    {`[${AppointmentStatusText[message.content.apptStatus]}] `}
                                    {(byUser ? 'Bạn' : message.sender.lastName) + ' đã đề xuất cuộc hẹn '}
                                         <span className="appointment-title">{message.content.title}</span>
                                    {' vào lúc:'}   
                                </div>
                                <div className="message-item-content-appointment-date">
                                    <span className="appointment-time">
                                        {format(new Date(message.content.date), 'HH:mm')}
                                    </span>
                                    <span className="appointment-date">
                                        {format(new Date(message.content.date), "dd 'thg' MM',' yyyy")}
                                    </span>
                                </div>
                                <div className="message-item-content-appointment-btn">
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setShowApptFormModal(true);
                                    }} className="btn-detail">Xem chi tiết</button>
                                {
                                    !byUser && message.content.apptStatus === AppointmentStatus.PENDING && 
                                    <button onClick={(e) => onAcceptApt(e, message._id)} className="btn-accept">Chấp nhận</button>
                                }
                                {
                                   ((!byUser && message.content.apptStatus === AppointmentStatus.ACCEPTED)
                                    || (byUser))
                                    
                                    &&
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setShowConfirmCancelModal(true);
                                    }} className="btn-cancel">Huỷ</button>
                                }
                                </div>
                            </div>
                        )
                    }
                    <div className="message-item-date">
                        <span>{showDate ? formatFullDatetime(message.createdAt) : ''}</span>
                    </div>
                </div>
    
            </div>
        </>
    )
}

export default MessageItem;