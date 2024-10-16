import { Link } from 'react-router-dom';
import './NotificationPopup.css';
import { useEffect, useState } from 'react';
import { NoticationAPI } from '../../API/NotificatoinAPI';

const NotificationPopup = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            NoticationAPI.getNotifications().then((response) => {
                setNotifications(response.data);
            });
        }
        fetchNotifications();
    }, []);
    return (
        <div className="notification-popup">
            <h3>Thông báo</h3>
            {notifications.map((notification) => (
                <Link to={notification.actionUrl} style={{ textDecoration: 'none' }}>
                    <div key={notification._id} className="notification-item">
                        <img src={notification.imageUrl} alt="Avatar" className="avatar" />
                        <div>
                            {/* <strong>{notification.username}</strong> {notification.message} */}
                            <span>{notification.content}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default NotificationPopup;