import { useEffect, useState } from 'react';
import LayoutManageRecordsPage from '../LayoutManageRecordsPage';
import './NotificationsPage.css';
import { NotificationAPI } from '../../../../../API/NotificatoinAPI';
import { useNavigate } from 'react-router-dom';

// const notifications = [
//     { id: 1, content: "Tài khoản của bạn đã được xác thực", createAt: "2021-10-10", isRead: true },
//     { id: 2, content: "Nguyễn Văn A đã đặt lịch khám cho bạn vào ngày 15/10/2021", createAt: "2021-10-10", isRead: false },
//     { id: 3, content: "Nguyễn Văn B đã đặt lịch khám cho bạn vào ngày 20/10/2021", createAt: "2021-10-10", isRead: false },
//     { id: 4, content: "Nguyễn Văn C đã đặt lịch khám cho bạn vào ngày 25/10/2021", createAt: "2021-10-10", isRead: false },
//     { id: 5, content: "Nguyễn Văn D đã đặt lịch khám cho bạn vào ngày 30/10/2021", createAt: "2021-10-10", isRead: false },
//     { id: 6, content: "Nguyễn Văn E đã đặt lịch khám cho bạn vào ngày 05/11/2021", createAt: "2021-10-10", isRead: false },
//     { id: 7, content: "Nguyễn Văn F đã đặt lịch khám cho bạn vào ngày 10/11/2021", createAt: "2021-10-10", isRead: false },
//     { id: 8, content: "Nguyễn Văn G đã đặt lịch khám cho bạn vào ngày 15/11/2021", createAt: "2021-10-10", isRead: false },
//     { id: 9, content: "Nguyễn Văn H đã đặt lịch khám cho bạn vào ngày 20/11/2021", createAt: "2021-10-10", isRead: false }
// ];

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [visibleNotifications, setVisibleNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 4;

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);
    const navigate = useNavigate();

    useEffect(() => {
        NotificationAPI.getNotifications().then((response) => {
            setNotifications(response.data);
        });
    }, []);

    useEffect(() => {
        setVisibleNotifications([]);
        currentNotifications.forEach((notification, index) => {
            setTimeout(() => {
                setVisibleNotifications(prev => [...prev, notification]);
            }, index * 100);
        });
    }, [currentPage, notifications]);

    const handleMarkAsRead = (notification) => {
        navigate(notification.actionUrl);
        NotificationAPI.markAsRead([notification._id]).then(() => {
            setNotifications(prev => prev.map(notification => {
                if (notification._id === notification._id) {
                    return { ...notification, isRead: true };
                }
                return notification;
            }));
        });
    };

    const handleNextPage = () => {
        if (indexOfLastNotification < notifications.length) {
            setVisibleNotifications([]);
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setVisibleNotifications([]);
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <LayoutManageRecordsPage>
            <>
                <h2 className="title-manage-records">Thông báo của bạn</h2>

                {visibleNotifications.length > 0 ? visibleNotifications.map((notification) => (
                    <div className={`notification-card ${notification.isRead ? 'read' : 'unread'}`} key={notification._id} onClick={()=>handleMarkAsRead(notification)}>
                        <div className="notification-card-up">
                            <p>
                                {notification.content}
                            </p>
                            <p>
                                {/* Trả về thòi gian ngày giờ tháng năm dạng 24h */}
                                {new Date(notification.createdAt).toLocaleString('vi-VN', {
                                    hour12: false,
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                )) : <p style={{ color: "#2697EC" }}>Không có thông báo nào</p>}

                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Trang trước</button>
                    <button onClick={handleNextPage} disabled={indexOfLastNotification >= notifications.length}>Trang sau</button>
                </div>
            </>
        </LayoutManageRecordsPage>
    );
};

export default NotificationsPage;
