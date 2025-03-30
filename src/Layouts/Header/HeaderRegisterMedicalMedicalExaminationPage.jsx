import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './HeaderRegisterMedicalMedicalExaminationPage.css';
import { faBell, faNotesMedical, faSignOutAlt, faUser, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationAPI } from '../../API/NotificatoinAPI';


const HeaderRegisterMedicalExaminationPage = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showBellDropdown, setShowBellDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const bellDropdownRef = useRef(null);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')) || null;

    const unreadNotifications = notifications.filter(notification => !notification.isRead).length;

    useEffect(() => {
        if (!user) return;
        NotificationAPI.getNotifications().then((response) => {
            setNotifications(response.data);
        });
    }, []);

    // Đóng dropdown nếu click bên ngoài
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
            if (bellDropdownRef.current && !bellDropdownRef.current.contains(e.target)) {
                setShowBellDropdown(false);
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);

        }
    }, [showDropdown, showBellDropdown]);


    const handleNavigate = (path) => {
        navigate(path);
        setShowDropdown(false);
    }

    const handleMaskAsRead = (notification) => {
        navigate(notification.actionUrl);
        NotificationAPI.markAsRead([notification._id]).then(() => {
            setNotifications(prev => prev.map(notification => {
                if (notification._id === notification._id) {
                    return { ...notification, isRead: true };
                }
                return notification;
            }));
        });
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setShowDropdown(false);
        navigate('/');
    }




    return (
        <div className="header-register-medical-examination-page" >
            <div className="logo" onClick={() => handleNavigate('/')}>
                <img src="/images/Logo.png" alt="logo" />
            </div>
            <div className="user-info" ref={dropdownRef} >
                {user && (
                    <div className="notification-bell" ref={bellDropdownRef}>
                        <div className="notification-icon-wrapper">
                            <FontAwesomeIcon
                                icon={faBell}
                                className="icon-bell"
                                onClick={() => setShowBellDropdown(!showBellDropdown)}
                            />
                            {unreadNotifications > 0 && (
                                <div className="notification-count">{unreadNotifications}</div>
                            )}
                        </div>

                        {showBellDropdown && (
                            <div className="bell-dropdown-container">
                                {notifications.length > 0 ? (
                                    <>
                                        {notifications.slice(0, 2).map(notification => (
                                            <div
                                                key={notification._id}
                                                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                                onClick={() => handleMaskAsRead(notification)}
                                            >
                                                {notification.content}
                                                <br />
                                                <span className="notification-time">
                                                    {new Date(notification.createdAt).toLocaleString('vi-VN', {
                                                        hour12: false,
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }).replace(',', '')}
                                                </span>
                                            </div>
                                        ))}

                                        <div className="notification-bell-footer">
                                            <button className="view-all-notification" onClick={() => handleNavigate('/notifications')}>
                                                Xem tất cả thông báo
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p>Không có thông báo mới</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {user ? (
                    <button className="user-button" onClick={() => setShowDropdown(!showDropdown)}>
                        <img src="/images/Account.png" alt="user" />
                        <span>{user.firstName} {user.lastName}</span>
                    </button>
                ) : (
                    <button className="user-button" onClick={() => handleNavigate('/login')}>
                        <img src="/images/Account.png" alt="user" />
                        Tài khoản
                    </button>
                )}



                {showDropdown && (
                    <div className="dropdown-menu " >
                        <div className="dropdown-header">
                            <img src="/images/Account.png" alt="user" />
                            <p>Xin chào, <b>{user?.firstName} {user?.lastName}</b></p>

                        </div>
                        <ul>
                            <li onClick={() => handleNavigate('/manage-records')}>
                                <FontAwesomeIcon icon={faUser} /> Hồ sơ bệnh nhân
                            </li>
                            <li onClick={() => handleNavigate('/my-appointments')}>
                                <FontAwesomeIcon icon={faCalendarCheck} /> Lịch khám của tôi
                            </li>
                            <li onClick={() => handleNavigate('/notifications')}>
                                <FontAwesomeIcon icon={faNotesMedical} /> Thông báo
                            </li>
                            <li className="logout" onClick={() => handleLogout()} style={{ color: 'red' }}>
                                <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                            </li>
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}
export default HeaderRegisterMedicalExaminationPage;
