import { Link } from 'react-router-dom';
import './NotificationPopup.css';
import { useEffect } from 'react';
import { markAsRead } from '../../redux/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';

const NotificationPopup = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);

    useEffect(() => {
        const markAsReadAll = async () => {
            const notificationIds = notifications.filter((notification) => !notification.isRead).map((notification) => notification._id);
            if (notificationIds.length > 0) {
                dispatch(markAsRead(notificationIds));
            }
        }

        // mark as read all on unmount
        return () => {
            markAsReadAll();
        };
    }, []);

    return (
        <div className="notification-popup">
            <h3>Thông báo</h3>
            {notifications.map((notification) => (
                <Link 
                    key={notification._id} 
                    className={`notification-item ${notification.isRead ? '' : 'unread'}`} 
                    to={notification.actionUrl} style={{ textDecoration: 'none' }}
                >
                    <img src={notification.imageUrl} alt="Avatar" className="avatar" />
                    <div>
                        {/* <strong>{notification.username}</strong> {notification.message} */}
                        <span>{notification.content}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default NotificationPopup;